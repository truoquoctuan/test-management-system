package com.tms_run.service.Impl;

import com.tms_run.cmmn.base.BaseEntity;
import com.tms_run.cmmn.base.PageInfo;
import com.tms_run.cmmn.config.RabbitConfig.IssuesCauseSolutionSender;
import com.tms_run.cmmn.util.Constant;
import com.tms_run.cmmn.util.FileUtil;
import com.tms_run.cmmn.util.TokenUtils;
import com.tms_run.dto.AttachFileDTO;
import com.tms_run.dto.CauseSolutionDTO;
import com.tms_run.dto.IssuesCreateDTO;
import com.tms_run.dto.IssuesDTO;
import com.tms_run.dto.IssuesFilterDTO;
import com.tms_run.dto.IssuesModifyDTO;
import com.tms_run.dto.IssuesPage;
import com.tms_run.dto.LabelDTO;
import com.tms_run.dto.TestCaseDTO;
import com.tms_run.entity.AttachFile;
import com.tms_run.entity.Issues;
import com.tms_run.entity.LabelEntity;
import com.tms_run.entity.TestCaseIssues;
import com.tms_run.entity.TestPlan;
import com.tms_run.entity.Users;
import com.tms_run.repository.*;
import com.tms_run.service.CommentService;
import com.tms_run.service.FileService;
import com.tms_run.service.IssuesService;
import com.tms_run.service.MailService;
import com.tms_run.service.TestPlanService;
import com.tms_run.service.UsersService;
import com.tms_run.socket.NotificationService;
import com.tms_run.socket.Notify;
import com.tms_run.socket.NotifyRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.Collator;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class IssuesServiceImpl implements IssuesService {
    private final ModelMapper modelMapper;
    private final IssuesRepository issuesRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;
    private final TestPlanRepository testPlanRepository;
    private final AssignRepository assignRepository;
    private final UsersService usersService;
    private final TestCaseIssuesRepository testCaseIssuesRepository;
    private final LabelEntityRepository labelEntityRepository;
    private final LabelRepository labelRepository;
    private final TestCaseRepository testCaseRepository;
    private final MemberSettingRepository memberSettingRepository;
    private final NotifyRepository notifyRepository;
    private final NotificationService notificationService;
    private final MailService mailService;
    private final TestPlanService testPlanService;
    private final CommentService commentService;
    private final MemberRepository memberRepository;
    private final IssuesCauseSolutionSender issuesCauseSolutionSender;

    private static final int BUFFER_SIZE = 512 * 1024;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @Override
    public Boolean createIssues(IssuesCreateDTO issuesDTO) {
        if (issuesDTO != null) {
            Long testPlanId = issuesDTO.getTestPlanId();
            if (checkRoleMember(testPlanId) == null) return null;

            Issues issues = modelMapper.map(issuesDTO, Issues.class);
            TestPlan testPlan = testPlanRepository.getTestPlanByTestPlanId(issuesDTO.getTestPlanId());
            issues.setTestPlan(testPlan);
            issues.setIssuesName(issuesDTO.getIssuesName().trim());

            if (issues.getStartDate() == null || issues.getEndDate() == null) {
                issues = issuesRepository.save(issues);
            } else if (validateStartAndEndDate(issues.getStartDate(), issues.getEndDate())) {
                issues = issuesRepository.save(issues);
            } else {
                return false;
            }

            //add new assigns
            saveAssign(issuesDTO, issues);

            // add new testCaseIssues
            saveTestCaseSelection(issuesDTO, issues);

            // add new labelEntity
            saveLabels(issuesDTO, issues);

            String uploadKey = ((BaseEntity) issues).getUploadKey();
            if (StringUtils.isNotEmpty(uploadKey)) {
                String groupId = String.format("%s-%s", issues.getClass().getSimpleName(), ((BaseEntity) issues).getSeq());
                fileService.updateGroupId(uploadKey, groupId);
            }

            updateTestPlanUpdateTime(testPlanId);

            return true;
        }
        return false;

    }

    @Override
    public Boolean modifyIssues(IssuesModifyDTO issuesModifyDTO) {
        Issues issues = issuesRepository.findIssuesByIssuesId(issuesModifyDTO.getIssuesId());
        if (issues != null) {
            Long testPlanId = issues.getTestPlan().getTestPlanId();
            if (checkRoleMember(testPlanId) == null) return null;

            modelMapper.map(issuesModifyDTO, issues);
            issues.setIssuesName(issuesModifyDTO.getIssuesName().trim());

            String uploadKey = ((BaseEntity) issues).getUploadKey();
            if (StringUtils.isNotEmpty(uploadKey)) {
                String groupId = String.format("%s-%s", issues.getClass().getSimpleName(), ((BaseEntity) issues).getSeq());
                fileService.updateGroupId(uploadKey, groupId);
            }

            issues.setUpdatedAt(LocalDateTime.now());

            issuesRepository.save(issues);

            updateTestPlanUpdateTime(testPlanId);
            return true;
        }
        return false;
    }

    @Override
    public Boolean modifyAssigns(String assignIds, Long issuesId, String userId) {
        Long testPlanId = issuesRepository.getTestPlanIdByIssuesId(issuesId);
        if (checkRoleMember(testPlanId) == null) return null;
        Issues issues = issuesRepository.findIssuesByIssuesId(issuesId);

        if (assignIds != null && issues != null) {
            if (assignIds.trim().equals("")) {
                assignRepository.removeAssignsByUserIdNullAndEntityIdAndType(issuesId, 2);
                assignRepository.removeAssignsByEntityIdAndType(issuesId, 2);
                assignRepository.saveAssign(null, 2, issuesId);
                issues.setUpdatedAt(LocalDateTime.now());
                issuesRepository.save(issues);
                return true;
            }
            List<Set<String>> listOfSetOfIds = get2SetOfIdsFromAssign(
                    assignRepository.getUserIdByEntityIdAndType(issuesId, 2),
                    Arrays.stream(assignIds.split(","))
                            .map(String::trim)
                            .collect(Collectors.toList()));

            if (!listOfSetOfIds.get(0).isEmpty()) {
                for (String assignId : listOfSetOfIds.get(0)) {
                    assignRepository.removeAssignsByUserIdAndEntityIdAndType(assignId, issuesId, 2);
                }
            }
            if (!listOfSetOfIds.get(1).isEmpty()) {
                for (String assignId : listOfSetOfIds.get(1)) {
                    assignRepository.removeAssignsByUserIdNullAndEntityIdAndType(issuesId, 2);
                    assignRepository.saveAssign(assignId, 2, issuesId);
                    if (!Objects.equals(assignId, userId)) {
                        saveAndSendNotificationIssuesAssign(issues, testPlanId, assignId, userId);
                    }
                }
            }

            issues.setUpdatedAt(LocalDateTime.now());
            issuesRepository.save(issues);
            updateTestPlanUpdateTime(testPlanId);
            return true;
        }
        return false;
    }

    @Override
    public Boolean modifyTestCases(String testCaseIds, Long issuesId) {
        Long testPlanId = issuesRepository.getTestPlanIdByIssuesId(issuesId);
        if (checkRoleMember(testPlanId) == null) return null;
        Issues issues = issuesRepository.findIssuesByIssuesId(issuesId);

        if (testCaseIds != null && issues != null) {
            if (testCaseIds.trim().equals("")) {
                testCaseIssuesRepository.removeTestCaseIssuesByIssuesId(issuesId);
                issues.setUpdatedAt(LocalDateTime.now());
                issuesRepository.save(issues);
                return true;
            }
            List<Long> existingTestCaseIds = testCaseIssuesRepository.getTestCaseIdByIssuesId(issuesId);
            List<Long> newTestCaseIds = Arrays.stream(testCaseIds
                            .split(","))
                    .map(String::trim)
                    .map(Long::parseLong)
                    .collect(Collectors.toList());
            List<Set<Long>> listOfSetOfIds = get2SetOfIdsFromTestCase(existingTestCaseIds, newTestCaseIds);

            if (!listOfSetOfIds.get(0).isEmpty()) {
                for (Long testCaseId : listOfSetOfIds.get(0)) {
                    testCaseIssuesRepository.removeTestCaseIssuesByTestCaseIdAndIssuesId(testCaseId, issuesId);
                    issues.setUpdatedAt(LocalDateTime.now());
                    issuesRepository.save(issues);
                }
            }
            if (!listOfSetOfIds.get(1).isEmpty()) {
                for (Long testCaseId : listOfSetOfIds.get(1)) {
                    TestCaseIssues testCaseIssues = new TestCaseIssues();
                    testCaseIssues.setIssues(issuesRepository.findIssuesByIssuesId(issuesId));
                    testCaseIssues.setTestCase(testCaseRepository.findTestCaseById(testCaseId));
                    issues.setUpdatedAt(LocalDateTime.now());
                    issuesRepository.save(issues);
                    testCaseIssuesRepository.save(testCaseIssues);
                }
            }
            updateTestPlanUpdateTime(testPlanId);
            return true;
        }
        return false;
    }

    @Override
    public Boolean modifyStartDate(String startDateStr, Long issuesId) {
        Long testPlanId = issuesRepository.getTestPlanIdByIssuesId(issuesId);
        if (checkRoleMember(testPlanId) == null) return null;

        LocalDateTime startDate = null;
        Issues issues = issuesRepository.findIssuesByIssuesId(issuesId);
        if (issues != null) {
            if (startDateStr == null || startDateStr.trim().equals("")) {
                issues.setStartDate(null);
                issues.setUpdatedAt(LocalDateTime.now());
                updateTestPlanUpdateTime(testPlanId);

                issuesRepository.save(issues);
            } else {
                startDate = convertToLocalDateTime(startDateStr);
                if (issues.getEndDate() == null) {
                    issues.setStartDate(startDate);
                    issues.setUpdatedAt(LocalDateTime.now());
                    updateTestPlanUpdateTime(testPlanId);

                    issuesRepository.save(issues);
                } else {
                    return modifyStartOrEndDate(startDate, issues.getEndDate(), issues);
                }
            }
            return true;
        }
        return false;
    }

    @Override
    public Boolean modifyEndDate(String endDateStr, Long issuesId) {
        Long testPlanId = issuesRepository.getTestPlanIdByIssuesId(issuesId);
        if (checkRoleMember(testPlanId) == null) return null;

        LocalDateTime endDate = null;
        Issues issues = issuesRepository.findIssuesByIssuesId(issuesId);
        if (issues != null) {
            if (endDateStr == null || endDateStr.trim().equals("")) {
                issues.setEndDate(null);
                issues.setUpdatedAt(LocalDateTime.now());
                updateTestPlanUpdateTime(testPlanId);

                issuesRepository.save(issues);
            } else {
                endDate = convertToLocalDateTime(endDateStr);
                if (issues.getStartDate() == null) {
                    issues.setEndDate(endDate);
                    issues.setUpdatedAt(LocalDateTime.now());
                    updateTestPlanUpdateTime(testPlanId);

                    issuesRepository.save(issues);
                } else {
                    return modifyStartOrEndDate(issues.getStartDate(), endDate, issues);
                }
            }
            return true;
        }
        return false;
    }

    @Override
    public Boolean modifyPriority(Integer priority, Long issuesId) {
        Issues issues = issuesRepository.findIssuesByIssuesId(issuesId);
        if (issues != null) {
            Long testPlanId = issues.getTestPlan().getTestPlanId();
            if (checkRoleMember(testPlanId) == null) return null;

            issues.setPriority(priority);
            issues.setUpdatedAt(LocalDateTime.now());
            issuesRepository.save(issues);
            updateTestPlanUpdateTime(testPlanId);

            return true;
        }
        return false;
    }

    private Boolean modifyStartOrEndDate(LocalDateTime startDate, LocalDateTime endDate, Issues issues) {
        if (validateStartAndEndDate(startDate, endDate)) {
            issues.setEndDate(endDate);
            issues.setStartDate(startDate);
            issues.setUpdatedAt(LocalDateTime.now());
            updateTestPlanUpdateTime(issuesRepository.getTestPlanIdByIssuesId(issues.getIssuesId()));

            issuesRepository.save(issues);
            return true;
        }
        return false;
    }

    private List<Set<String>> get2SetOfIdsFromAssign(List<String> oldIds, List<String> newIds) {
        List<Set<String>> setOfIds = new ArrayList<>();

        Set<String> oldIdSet = new HashSet<>(oldIds);
        Set<String> newIdSet = new HashSet<>(newIds);

        Set<String> oldNotNewId = new HashSet<>(oldIdSet);
        oldNotNewId.removeAll(newIdSet);

        Set<String> newNotOldId = new HashSet<>(newIdSet);
        newNotOldId.removeAll(oldIdSet);

        setOfIds.add(oldNotNewId);
        setOfIds.add(newNotOldId);
        return setOfIds;
    }

    private List<Set<Long>> get2SetOfIdsFromTestCase(List<Long> oldIds, List<Long> newIds) {
        List<Set<Long>> setOfIds = new ArrayList<>();

        Set<Long> oldIdSet = new HashSet<>(oldIds);
        Set<Long> newIdSet = new HashSet<>(newIds);

        Set<Long> oldNotNewId = new HashSet<>(oldIdSet);
        oldNotNewId.removeAll(newIdSet);

        Set<Long> newNotOldId = new HashSet<>(newIdSet);
        newNotOldId.removeAll(oldIdSet);

        setOfIds.add(oldNotNewId);
        setOfIds.add(newNotOldId);
        return setOfIds;
    }

    private Boolean validateStartAndEndDate(Object startDate, Object endDate) {
        return convertToLocalDateTime(startDate).isBefore(convertToLocalDateTime(endDate)) ||
                convertToLocalDateTime(startDate).isEqual(convertToLocalDateTime(endDate));
    }

    private LocalDateTime convertToLocalDateTime(Object dateTime) {
        if (dateTime instanceof String) {
            try {
                return LocalDateTime.parse((String) dateTime, FORMATTER);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException(e.getMessage());
            }
        } else if (dateTime instanceof LocalDateTime) {
            return (LocalDateTime) dateTime;
        }
        throw new IllegalArgumentException();
    }

    private void saveAssign(IssuesCreateDTO issuesDTO, Issues issues) {
        try {
            String assignIds = issuesDTO.getAssignIds();
            if (assignIds != null && !assignIds.trim().equals("")) {
                if (assignIds.contains(",")) {
                    List<String> assignIdsList = Arrays.stream(assignIds.split(","))
                            .map(id -> id.trim())
                            .collect(Collectors.toList());
                    for (String assignId : assignIdsList) {
                        assignRepository.saveAssign(assignId, 2, issues.getIssuesId());
                        if (!assignId.equals(issues.getCreatedBy())) {
                            saveAndSendNotificationIssuesAssign(issues, issuesDTO.getTestPlanId(), assignId, issuesDTO.getCreatedBy());
                        }
                    }
                } else {
                    String assignId = assignIds.trim();
                    assignRepository.saveAssign(assignId, 2, issues.getIssuesId());
                    saveAndSendNotificationIssuesAssign(issues, issuesDTO.getTestPlanId(), assignId, issuesDTO.getCreatedBy());
                }
            } else {
                assignRepository.saveAssign(null, 2, issues.getIssuesId());
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    private void saveTestCaseSelection(IssuesCreateDTO issuesDTO, Issues issues) {
        try {
            String testCaseSelection = issuesDTO.getTestCaseSelection();
            if (testCaseSelection != null && !testCaseSelection.trim().equals("")) {
                List<String> testCaseSelectionList = Arrays.stream(testCaseSelection.split(","))
                        .map(id -> id.trim())
                        .collect(Collectors.toList());
                for (String testCase : testCaseSelectionList) {
                    TestCaseIssues testCaseIssues = new TestCaseIssues();
                    testCaseIssues.setIssues(issues);
                    testCaseIssues.setTestCase(testCaseRepository.findTestCaseById(Long.valueOf(testCase)));
                    testCaseIssuesRepository.save(testCaseIssues);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    private void saveLabels(IssuesCreateDTO issuesDTO, Issues issues) {
        try {
            String labels = issuesDTO.getLabels();
            if (labels != null && !labels.trim().equals("")) {
                List<String> labelsList = Arrays.stream(labels.split(","))
                        .map(id -> id.trim())
                        .collect(Collectors.toList());
                for (String label : labelsList) {
                    Long labelId = Long.valueOf(label);
                    LabelEntity labelEntity = new LabelEntity();
                    labelEntity.setEntityId(issues.getIssuesId());
                    labelEntity.setLabel(labelRepository.findLabelByLabelId(labelId));

                    labelEntityRepository.save(labelEntity);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public IssuesDTO getIssuesById(Long issuesId) {
        Long testPlanId = issuesRepository.getTestPlanIdByIssuesId(issuesId);
        if (checkRoleMember(testPlanId) == null) return null;

        Issues issues = issuesRepository.findIssuesByIssuesId(issuesId);
        IssuesDTO issuesDTO = modelMapper.map(issues, IssuesDTO.class);
        issuesDTO.setTestPlan(issues.getTestPlan());

        Users createdUser = usersService.findUserDisabledById(issues.getCreatedBy());
        issuesDTO.setCreator(createdUser);

        List<String> userIds = assignRepository.getUserIdByEntityIdAndType(issues.getIssuesId(), 2);
        List<Users> assignUsers = userIds.stream()
                .map(user -> usersService.findUserDisabledById(user))
                .collect(Collectors.toList());
        issuesDTO.setUsers(assignUsers);

        List<Users> users = new ArrayList<>();
        if (!userIds.isEmpty()) {
            users = userIds.stream()
                    .map(id -> usersService.findUserDisabledById(id))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }

        issuesDTO.setUsers(users);

        List<Long> testCaseIds = testCaseIssuesRepository.getTestCaseIdByIssuesId(issues.getIssuesId());
        List<TestCaseDTO> testCaseDTOList = testCaseIds
                .stream()
                .map(testCaseId -> testCaseRepository.findTestCaseById(testCaseId))
                .map(testCase -> modelMapper.map(testCase, TestCaseDTO.class))
                .toList();
        issuesDTO.setTestCases(testCaseDTOList);

        List<Long> labelIds = labelRepository.finAllLabelIdsByLabelTypeAndEntityId(2, issuesId);
        List<LabelDTO> labelDTOList = labelIds.stream()
                .map(id -> labelRepository.findLabelByLabelId(id))
                .map(labelEntity -> modelMapper.map(labelEntity, LabelDTO.class))
                .toList();
        issuesDTO.setLabelsList(labelDTOList);

        String groupId = String.format("%s-%s", issues.getClass().getSimpleName(), ((BaseEntity) issues).getSeq());
        List<AttachFile> attachFileList = fileRepository.findFileByGroupId(groupId);
        List<AttachFileDTO> attachFileDTOList = new ArrayList<>();

        if (!attachFileList.isEmpty()) {
            for (AttachFile attachFile : attachFileList) {
                AttachFileDTO attachFileDTO = modelMapper.map(attachFile, AttachFileDTO.class);
                attachFileDTOList.add(attachFileDTO);
            }
        }
        if (!attachFileDTOList.isEmpty()) {
            issuesDTO.setFiles(attachFileDTOList);
        }

        return issuesDTO;
    }

    @Override
    public void updateIssuesStatus(Long issuesId, int status, String userId) {
        try {
            Long testPlanId = issuesRepository.getTestPlanIdByIssuesId(issuesId);
            if (checkRoleMember(testPlanId) == null) return;

            issuesRepository.updateIssuesStatus(status, issuesId);
            Issues issues = issuesRepository.findIssuesByIssuesId(issuesId);
            issues.setUpdatedAt(LocalDateTime.now());
            issuesRepository.save(issues);

            List<String> assignIds = assignRepository.getUserIdByEntityIdAndType(issuesId, 2);
            for (String assignId : assignIds) {
                if (!Objects.equals(assignId, userId)) {
                    String content = status == 1 ? "Unresolved" : status == 2 ? "Resolved" : "Non-issue";
                    saveAndSendNotificationIssuesStatus(issues, testPlanId, assignId, content, userId);

                }
            }
            updateTestPlanUpdateTime(testPlanId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void removeIssues(List<Long> issuesIds) {
        try {
            List<Long> testPlanIds = issuesIds.stream()
                    .map(issuesId -> issuesRepository.findIssuesByIssuesId(issuesId).getTestPlan().getTestPlanId())
                    .collect(Collectors.toList());
            if (testPlanIds.size() >= 1 && testPlanIds.stream().distinct().count() == 1) {
                testPlanIds.subList(1, testPlanIds.size()).clear();
            } else {
                return;
            }
            if (checkRoleMember(testPlanIds.get(0)) == null) return;
            issuesRepository.removeIssuesByIssuesIds(issuesIds);

            List<Long> labelIdList = labelRepository.findAllLabelsIdByLabelType(2);
            for (Long issuesId : issuesIds) {
                assignRepository.removeAssignsByEntityIdAndType(issuesId, 2);
                assignRepository.removeAssignsByUserIdNullAndEntityIdAndType(issuesId, 2);
                labelEntityRepository.removeLabelEntitiesByLabelIdsAndEntityId(labelIdList, issuesId);
                commentService.deleteAllCommentsByEntityIdAndType(issuesId, 2);
            }
            updateTestPlanUpdateTime(testPlanIds.get(0));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private List<Long> getAllIssuesIdsContainingId(List<Long> inputList) {
        List<Long> output = new ArrayList<>();
        if (inputList == null) {
            return output;
        }
        List<String> input = inputList.stream()
                .map(id -> String.valueOf(id))
                .toList();
        for (String s : input) {
            List<Long> issuesId = issuesRepository.getAllIssuesIdsContainingId(s);
            if (issuesId.isEmpty()) {
                output.add(-1L);
                return output;
            }
            issuesId.forEach(id -> {
                output.add(id);
            });
        }
        return output;
    }

    private List<Long> getAllTestCaseIdsContainingId(List<Long> inputList) {
        List<Long> output = new ArrayList<>();
        if (inputList == null) {
            return output;
        }
        List<String> input = inputList.stream()
                .map(id -> String.valueOf(id))
                .toList();
        for (String s : input) {
            List<Long> testCaseId = issuesRepository.getAllTestCaseIdsContainingIdFromIssues(s);
            if (testCaseId.isEmpty()) {
                output.add(-1L);
                return output;
            } else {
                testCaseId.forEach(id -> {
                    output.add(id);
                });
            }
        }
        return output;
    }

    @Override
    public IssuesPage getAllIssues(IssuesFilterDTO issuesFilterDTO, String sorted, Integer page, Integer size) {
        Long testPlanId = issuesFilterDTO.getTestPlanId();
        if (checkRoleMember(testPlanId) == null) return null;

        try {
            String startDate = null;
            String endDate = null;
            if (issuesFilterDTO.getDueDate() != null && !issuesFilterDTO.getDueDate().trim().isEmpty()) {
                String[] date = issuesFilterDTO.getDueDate().split("/");
                if (date.length == 2) {
                    startDate = date[0];
                    endDate = date[1];
                }
            }
            List<Long> testCaseIdsFilter = issuesFilterDTO.getExactFilterMatch() ?
                    issuesFilterDTO.getTestCaseIds() : getAllTestCaseIdsContainingId(issuesFilterDTO.getTestCaseIds());

            Pageable pageable = PageRequest.of(page, size, parseSortString(sorted));

            Page<Issues> issuesPage = issuesRepository.getAllIssues(issuesFilterDTO.getTestPlanId(),
                    getAllIssuesIdsContainingId(issuesFilterDTO.getIssuesIds()), issuesFilterDTO.getIssuesName(), issuesFilterDTO.getAssignIds(),
                    testCaseIdsFilter, issuesFilterDTO.getPriorities(), issuesFilterDTO.getTags(),
                    issuesFilterDTO.getStatus(), startDate, endDate,issuesFilterDTO.getExactFilterMatch(), pageable);
            List<IssuesDTO> issuesDTOS = issuesPage.getContent().stream().map(
                    issues -> {
                        IssuesDTO issuesDTO = modelMapper.map(issues, IssuesDTO.class);
                        List<String> userAssignIds = assignRepository.getUserIdByEntityIdAndType(issues.getIssuesId(), 2);
                        List<Users> users = userAssignIds.stream().map(userAssignId -> usersService.findUserDisabledById(userAssignId)).filter(Objects::nonNull).collect(Collectors.toList());

                        List<Long> testCaseIds = testCaseIssuesRepository.getTestCaseIdByIssuesId(issues.getIssuesId());
                        List<TestCaseDTO> testCaseDTOList = testCaseIds
                                .stream()
                                .map(testCaseId -> testCaseRepository.findTestCaseById(testCaseId))
                                .map(testCase -> modelMapper.map(testCase, TestCaseDTO.class))
                                .toList();
                        issuesDTO.setTestCases(testCaseDTOList);

                        List<Long> labelIdList = labelRepository.finAllLabelIdsByLabelTypeAndEntityId(2, issues.getIssuesId());
                        List<LabelDTO> labelDTOList = labelIdList.stream()
                                .map(id -> labelRepository.findLabelByLabelId(id))
                                .map(labelEntity -> modelMapper.map(labelEntity, LabelDTO.class))
                                .toList();
                        issuesDTO.setLabelsList(labelDTOList);
                        issuesDTO.setUsers(users);
                        return issuesDTO;
                    }
            ).collect(Collectors.toList());

            applyCollatorSorting(issuesDTOS, sorted);

            issuesDTOS.forEach(x -> {
                if (x.getCreatedBy() != null) {
                    x.setCreator(usersService.findUserDisabledById(x.getCreatedBy()));
                }
            });
            PageInfo pageInfo = new PageInfo(issuesPage.getTotalPages(), (int) issuesPage.getTotalElements(), issuesPage.getNumber(), issuesPage.getSize());
            return new IssuesPage(issuesDTOS, pageInfo);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private Sort parseSortString(String sort) {
        if (sort == null || sort.isEmpty()) {
            return Sort.unsorted();
        }
        String[] sortParams = sort.split("\\+");
        String fieldName = sortParams[0];
        String direction = sortParams.length > 1 ? sortParams[1].toUpperCase() : "ASC";

        if (!direction.equals("ASC") && !direction.equals("DESC")) {
            direction = "ASC";  // Default to asc
        }
        return Sort.by(Sort.Direction.valueOf(direction), fieldName);
    }

    private void applyCollatorSorting(List<IssuesDTO> issuesDTOS, String sort) {
        if (sort == null || sort.isEmpty()) {
            return;
        }
        String[] sortParams = sort.split("\\+");
        String fieldName = sortParams[0];
        String direction = sortParams.length > 1 ? sortParams[1].toUpperCase() : "ASC";
        if (!fieldName.equals("issues_name")) {
            return;
        }

        Collator collator = Collator.getInstance(Locale.forLanguageTag("vi-VN"));
        Comparator<IssuesDTO> collatorComparator = (e1, e2) -> {
            String value1 = e1.getIssuesName();
            String value2 = e2.getIssuesName();
            return collator.compare(value1, value2);
        };

        if (direction.equals("DESC")) {
            issuesDTOS.sort(collatorComparator.reversed());
        } else {
            issuesDTOS.sort(collatorComparator);
        }
    }

    @Override
    public Boolean saveCauseSolution(Long issuesId, String cause, String solution) {
        String rs = issuesCauseSolutionSender.saveCauseSolution(String.valueOf(issuesId), cause, solution);
        Boolean flag = rs.contains("Y");
        if (flag) {
            notifyForSaveCauseAndSolution(issuesId);
        }
        updateTestPlanUpdateTime(issuesRepository.getTestPlanIdByIssuesId(issuesId));
        return flag;
    }

    @Override
    public CauseSolutionDTO getCauseAndSolution(Long issuesId) {
        try {
            Long testPlanId = issuesRepository.getTestPlanIdByIssuesId(issuesId);
            if (checkRoleMember(testPlanId) == null) return null;

            String groupId = Issues.class.getSimpleName() + "-" + issuesId + "-cs";
            List<AttachFile> attachFiles = fileRepository.findFileByGroupId(groupId);
            CauseSolutionDTO rs = new CauseSolutionDTO();
            for (AttachFile attachFile : attachFiles) {
                String filePath = FileUtil.getUploadPath() + attachFile.getSaveNm();
                String content = new String(Files.readAllBytes(Paths.get(filePath)));
                if (attachFile.getFileName().contains(issuesId + "-c")) {
                    rs.setCause(content);
                } else {
                    rs.setSolution(content);
                }
            }
            return rs;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void notifyForSaveCauseAndSolution(Long issuesId) {
        String creatorId = TokenUtils.getUserID();
        Users users = usersService.findUserDisabledById(creatorId);
        Long testPlanId = issuesRepository.getTestPlanIdByIssuesId(issuesId);
        List<String> userIds = memberRepository.getUserIdInTestPlan(testPlanId);
        Issues issues = issuesRepository.findIssuesByIssuesId(issuesId);
        for(String userId : userIds){
            if(!creatorId.equals(userId)){
                saveAndSendNotiForCauseSolution(users, testPlanId, userId, issues);
            }
        }
    }

    private void saveAndSendNotiForCauseSolution(Users sender, Long testPlanId, String userId, Issues issues) {
        Notify notify = new Notify();
        notify.setUserId(userId);
        notify.setSenderId(sender.getUserID());
        notify.setLink("/test-plan/issues/" + testPlanId + "/detail-issues/"+ issues.getIssuesId());
        notify.setNotifyContent(String.format(Constant.saveIssuesCauseSolution, sender.getFullName(), issues.getIssuesName()));
        String notifySetting = memberSettingRepository.getNotifySettingByUserIdAndTestPlanId(userId, testPlanId);
        String mailSetting = memberSettingRepository.getMailSettingByUserIdAndTestPlanId(userId, testPlanId);
        if (notifySetting != null && notifySetting.contains("7") && !Objects.equals(notify.getUserId(), notify.getSenderId())) {
            notify = notifyRepository.save(notify);
            notificationService.sendPrivateNotification(String.valueOf(userId), notify.getNotifyContent());
        }
        if (mailSetting != null && mailSetting.contains("7") && !Objects.equals(notify.getUserId(), notify.getSenderId())) {
            sendMail(userId, notify.getNotifyContent(), notify.getLink());
        }
    }

    private void saveContentToFile(String content, String destName, String fileName, String groupId) throws IOException {
        List<AttachFile> existingFiles = fileRepository.findFileByGroupId(groupId);
        File destFile = new File(destName);
        if (!destFile.getParentFile().exists()) {
            destFile.getParentFile().mkdirs();
        }
        boolean fileUpdated = false;
        if (!existingFiles.isEmpty()) {
            for (AttachFile existingFile : existingFiles) {
                if (existingFile.getFileName().equals(fileName)) {
                    File existingDestFile = new File(FileUtil.getUploadPath() + existingFile.getSaveNm());
                    if (existingDestFile.exists()) {
                        // Xóa nội dung cũ của file
                        new PrintWriter(existingDestFile).close();
                        appendContentToFile(content, existingDestFile);
                        existingFile.setFileSize(existingDestFile.length());
                        existingFile.setSaveDt(LocalDateTime.now());
                        fileRepository.save(existingFile);
                        fileUpdated = true;
                        break;
                    }
                }
            }
        }
        if (!fileUpdated) {
            appendContentToFile(content, destFile);
            long size = destFile.length();
            String saveName = DateFormatUtils.format(new Date(), "/yyyy/MM/") + UUID.randomUUID().toString() + ".txt";
            if (destFile.renameTo(new File(FileUtil.getUploadPath() + saveName))) {
                AttachFile attachFile = new AttachFile();
                attachFile.setGroupId(groupId);
                attachFile.setFileName(fileName);
                attachFile.setFileSize(size);
                attachFile.setSaveNm(saveName);
                attachFile.setSaveDt(LocalDateTime.now());
                fileRepository.save(attachFile);
            }
        }
    }

    private void appendContentToFile(String content, File destFile) throws IOException {
        boolean append = destFile.exists();
        try (OutputStream out = new BufferedOutputStream(new FileOutputStream(destFile, append), BUFFER_SIZE)) {
            byte[] buffer = content.getBytes();
            out.write(buffer, 0, buffer.length);
        }
    }

    private void saveAndSendNotificationIssuesAssign(Issues issues, Long testPlanId, String assignId, String senderId) {
        Notify notify = new Notify();
        notify.setUserId(assignId);
        notify.setSenderId(senderId);
        notify.setLink("/test-plan/issues/" + testPlanId + "/detail-issues/" + issues.getIssuesId());
        notify.setNotifyContent(String.format(Constant.assignIssuesEN, issues.getIssuesName()));
        String notifySetting = memberSettingRepository.getNotifySettingByUserIdAndTestPlanId(assignId, testPlanId);
        String mailSetting = memberSettingRepository.getMailSettingByUserIdAndTestPlanId(assignId, testPlanId);
        if (notifySetting != null && notifySetting.contains("5") && !Objects.equals(notify.getUserId(), notify.getSenderId())) {
            notify = notifyRepository.save(notify);
            notificationService.sendPrivateNotification(String.valueOf(assignId), notify.getNotifyContent());
        }
        if (mailSetting != null && mailSetting.contains("5") && !Objects.equals(notify.getUserId(), notify.getSenderId())) {
            sendMail(assignId, notify.getNotifyContent(), notify.getLink());
        }
    }

    private void saveAndSendNotificationIssuesStatus(Issues issues, Long testPlanId, String assignId, String status, String userId) {
        Notify notify = new Notify();
        notify.setUserId(assignId);
        notify.setSenderId(userId);
        notify.setLink("/test-plan/issues/" + testPlanId + "/detail-issues/" + issues.getIssuesId());
        notify.setNotifyContent(String.format(Constant.issuesChangeStatusEN, issues.getIssuesName(), status));
        String notifySetting = memberSettingRepository.getNotifySettingByUserIdAndTestPlanId(assignId, testPlanId);
        String mailSetting = memberSettingRepository.getMailSettingByUserIdAndTestPlanId(assignId, testPlanId);
        if (notifySetting != null && notifySetting.contains("6") && !Objects.equals(notify.getUserId(), notify.getSenderId())) {
            notify = notifyRepository.save(notify);
            notificationService.sendPrivateNotification(String.valueOf(assignId), notify.getNotifyContent());
        }
        if (mailSetting != null && mailSetting.contains("6") && !Objects.equals(notify.getUserId(), notify.getSenderId())) {
            sendMail(assignId, notify.getNotifyContent(), notify.getLink());
        }
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

    private String checkRoleMember(Long testPlanId) {
        String userId = TokenUtils.getUserID();
        if (testPlanService.getRoleInTestPlan(userId, testPlanId) == null && !TokenUtils.getUserRole().equals("ROLE_ADMIN")) {
            return null;
        }
        return "1";
    }

    private void updateTestPlanUpdateTime(Long testPlanId) {
        TestPlan testPlan = testPlanRepository.getTestPlanByTestPlanId(testPlanId);
        testPlan.setUpdatedAt(LocalDateTime.now());
        testPlanRepository.save(testPlan);
    }
}
