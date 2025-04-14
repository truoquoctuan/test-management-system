package com.tms_run.service.Impl;

import com.tms_run.cmmn.base.BaseCrudService;
import com.tms_run.cmmn.base.BaseEntity;
import com.tms_run.cmmn.base.PageInfo;
import com.tms_run.cmmn.exception.ResourceNotFoundException;
import com.tms_run.cmmn.util.Constant;
import com.tms_run.dto.AttachFileDTO;
import com.tms_run.dto.TestResultDTO;
import com.tms_run.dto.TestResultPage;
import com.tms_run.entity.*;
import com.tms_run.repository.*;
import com.tms_run.service.FileService;
import com.tms_run.service.MailService;
import com.tms_run.service.TestResultService;
import com.tms_run.service.UsersService;
import com.tms_run.socket.NotificationService;
import com.tms_run.socket.Notify;
import com.tms_run.socket.NotifyRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestResultServiceImpl extends BaseCrudService<TestResult, Long> implements TestResultService {

    private final ModelMapper modelMapper;
    private final UsersService usersService;
    private final TestCaseRepository testCaseRepository;
    private final TestResultRepository testResultRepository;
    private final FileRepository fileRepository;
    private final FileService fileService;
    private final MemberSettingRepository memberSettingRepository;
    private final NotifyRepository notifyRepository;
    private final NotificationService notificationService;
    private final MailService mailService;
    private final AssignRepository assignRepository;
    private final TestPlanRepository testPlanRepository;

    @Override
    public TestResultDTO createTestResult(TestResultDTO testResultDTO) {
        try {
            TestResult testResult = modelMapper.map(testResultDTO, TestResult.class);
            TestCase testCase = testCaseRepository.findTestCaseById(testResultDTO.getTestCaseId());
            testCase.setStatus(testResultDTO.getStatus());
            testCase = testCaseRepository.save(testCase);
            testResult.setTestCase(testCase);
            testResult = testResultRepository.save(testResult);

            Long testPlanId = testCaseRepository.getTestPlanIdByTestCaseId(testCase.getTestCaseId());
            String assignIds = testResultDTO.getAssignIds();
            if (assignIds != null && !assignIds.isEmpty()) {
                if (assignIds.contains(",")) {
                    List<String> assignIdList = Arrays.stream(assignIds.split(",")).map(id -> id.trim()).collect(Collectors.toList());
                    for (String assignId : assignIdList) {
                        saveAssign(assignId, testResult.getTestResultId(), 1);
                        if (assignId != testResultDTO.getUserId()) {
                            saveAndSendNoti(testResult, testCase, testPlanId, assignId);
                        }
                    }
                } else {
                    String assignId = assignIds.trim();
                    saveAssign(assignId, testResult.getTestResultId(), 1);
                    saveAndSendNoti(testResult, testCase, testPlanId, assignId);
                }
            }

            // update file's group id
            String uploadKey = ((BaseEntity) testResult).getUploadKey();
            if (StringUtils.isNotEmpty(uploadKey)) {
                String groupId = String.format("%s-%s", testResult.getClass().getSimpleName(), ((BaseEntity) testResult).getSeq());
                fileService.updateGroupId(uploadKey, groupId);
            }

            TestResultDTO dto = modelMapper.map(testResult, TestResultDTO.class);
            dto.setTestCaseId(testResultDTO.getTestCaseId());

            updateTestPlanUpdateTime(testPlanId);

            return dto;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to create test result", testResultDTO);
        }
    }

    @Override
    public TestResultPage getTestResultById(Long testCaseId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TestResult> testResultList = testResultRepository.findTestResultById(testCaseId, pageable);
        List<TestResultDTO> testResultDTOList = new ArrayList<>();
        List<TestResult> testResults = testResultList.getContent();
        for (TestResult testResult : testResults) {
            TestResultDTO testResultDTO = modelMapper.map(testResult, TestResultDTO.class);
            testResultDTO.setTestCaseId(testCaseId);

            Users userCreate = usersService.findUserDisabledById(testResultDTO.getUserId());
            testResultDTO.setCreateFullName(userCreate.getFullName());
            testResultDTO.setCreateUserName(userCreate.getUserName());

            List<String> userIds = assignRepository.getUserIdByEntityIdAndType(testResult.getTestResultId(), 1);
            List<Users> users = null;
            if (!userIds.isEmpty()) {
                users = userIds.stream().map(id -> usersService.findUserById(id)).filter(Objects::nonNull).collect(Collectors.toList());
            }
            testResultDTO.setUsers(users);

            List<AttachFileDTO> attachFileList = new ArrayList<>();
            if (!testResultDTO.getFileSeqs().isEmpty()) {
                String[] fileSeq = testResultDTO.getFileSeqs().split(",");
                for (String seq : fileSeq) {
                    AttachFile attachFile = fileRepository.findByFileSeq(Long.valueOf(seq));
                    AttachFileDTO attachFileDTO = modelMapper.map(attachFile, AttachFileDTO.class);
                    attachFileList.add(attachFileDTO);
                }
            }
            if (!attachFileList.isEmpty()) {
                testResultDTO.setFiles(attachFileList);
            }

            testResultDTOList.add(testResultDTO);
        }

        PageInfo pageInfo = new PageInfo(testResultList.getTotalPages(), (int) testResultList.getTotalElements(), testResultList.getNumber(), testResultList.getSize());
        return new TestResultPage(testResultDTOList, pageInfo);
    }

    private void saveAndSendNoti(TestResult testResult, TestCase testCase, Long testPlanId, String assignId) {
        Notify notify = new Notify();
        notify.setUserId(assignId);
        notify.setSenderId(testResult.getUserId());
        notify.setLink("/test-plan/run-result/" + testPlanId);
        notify.setNotifyContent(String.format(Constant.assignTestCaseEN, testCase.getTestCaseName()));
        String notifySetting = memberSettingRepository.getNotifySettingByUserIdAndTestPlanId(assignId, testPlanId);
        String mailSetting = memberSettingRepository.getMailSettingByUserIdAndTestPlanId(assignId, testPlanId);
        if (notifySetting != null && notifySetting.contains("3") && !Objects.equals(notify.getUserId(), notify.getSenderId())) {
            notify = notifyRepository.save(notify);
            notificationService.sendPrivateNotification(assignId, notify.getNotifyContent());
        }
        if (mailSetting != null && mailSetting.contains("3") && !Objects.equals(notify.getUserId(), notify.getSenderId())) {
            sendMail(assignId, notify.getNotifyContent(), notify.getLink());
        }
    }

    private void saveAssign(String userId, Long entityId, Integer type) {
        Assign assign = new Assign();
        assign.setUserId(userId);
        assign.setEntityId(entityId);
        assign.setAssignType(type);
        assignRepository.save(assign);
    }

    private void sendMail(String userId, String content, String link) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        try {
            executor.execute(() -> {
                mailService.sendMail(userId, content, link);
            });
        } finally {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }

    private void updateTestPlanUpdateTime(Long testPlanId) {
        TestPlan testPlan = testPlanRepository.getTestPlanByTestPlanId(testPlanId);
        testPlan.setUpdatedAt(LocalDateTime.now());
        testPlanRepository.save(testPlan);
    }
}
