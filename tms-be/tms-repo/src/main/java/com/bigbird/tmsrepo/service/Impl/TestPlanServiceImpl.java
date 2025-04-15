package com.bigbird.tmsrepo.service.Impl;

import com.bigbird.tmsrepo.cmmn.base.BaseCrudService;
import com.bigbird.tmsrepo.cmmn.base.BaseEntity;
import com.bigbird.tmsrepo.cmmn.base.PageInfo;
import com.bigbird.tmsrepo.cmmn.exception.ResourceNotFoundException;
import com.bigbird.tmsrepo.cmmn.util.Constant;
import com.bigbird.tmsrepo.cmmn.util.TokenUtils;
import com.bigbird.tmsrepo.dto.*;
import com.bigbird.tmsrepo.entity.*;
import com.bigbird.tmsrepo.repository.*;
import com.bigbird.tmsrepo.service.*;
import com.bigbird.tmsrepo.socket.NotificationService;
import com.bigbird.tmsrepo.socket.Notify;
import com.bigbird.tmsrepo.socket.NotifyService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestPlanServiceImpl extends BaseCrudService<TestPlan, Long> implements TestPlanService {
    private final TestPlanRepository testPlanRepository;
    private final MemberRepository memberRepository;
    private final ModelMapper modelMapper;
    private final MemberService memberService;
    private final UsersService usersService;
    private final FileService fileService;
    private final PinRepository pinRepository;
    private final NotifyService notifyService;
    private final NotificationService notificationService;
    private final MemberSettingRepository memberSettingRepository;
    private final MailService mailService;
    private final LabelRepository labelRepository;

    @Override
    public TestPlanPage getAllTestPlan(String userId, String name, List<String> createdBys, Integer status, String sorted, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, parseSortString(sorted));
            Page<TestPlanDTO> testPlans = null;
            String authResponse = TokenUtils.getUserRole();
            userId = TokenUtils.getUserID();
            if (authResponse.equals("ROLE_ADMIN")) {
                testPlans = testPlanRepository.getAllTestPlanForAdmin(userId, name, createdBys, status, pageable);
            } else if (authResponse.equals("ROLE_STAFF")) {
                testPlans = testPlanRepository.getAllTestPlan(userId, name, createdBys, status, pageable);
            }
            if (testPlans.isEmpty()) {
                PageInfo emptyPageInfo = new PageInfo(0, 0, page, size);
                return new TestPlanPage(Collections.emptyList(), emptyPageInfo);
            }
            PageInfo pageInfo = new PageInfo(testPlans.getTotalPages(), (int) testPlans.getTotalElements(), testPlans.getNumber(), testPlans.getSize());
            return new TestPlanPage(testPlans.getContent(), pageInfo);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResourceNotFoundException(e.toString(), "Fail to get all test plan with user id: ", userId);
        }
    }

    @Override
    public TestPlanDTO getTestPlanById(Long id) {
        try {
            String userId = TokenUtils.getUserID();
            if (getRoleInTestPlan(userId.trim(), id) > 0 && testPlanRepository.existsById(id)) {
                TestPlan testPlan = testPlanRepository.getTestPlanById(id);
                TestPlanDTO testPlanDTO = modelMapper.map(testPlan, TestPlanDTO.class);
                Users user = usersService.findUserDisabledById(testPlan.getCreatedBy());
                testPlanDTO.setUserInfo(user);
                return testPlanDTO;
            } else {
                return null;
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to get test_plan: ", id);
        }
    }

    @Override
    public TestPlanDTO saveTestPlan(TestPlanDTO testPlanDTO) {
        try {
            TestPlan testPlan = new TestPlan();
            Long id = testPlanDTO.getTestPlanId();
            String uploadKey = testPlanDTO.getUploadKey();
            if (id == null) {
                /*Add new test plan*/
                testPlan = modelMapper.map(testPlanDTO, TestPlan.class);
                testPlan.setMembers(null);
                testPlan = testPlanRepository.save(testPlan);
                createDefaultIssuesLabels(testPlan);
                Member member = new Member();
                member.setUserId(testPlanDTO.getCreatedBy());
                member.setTestPlan(testPlan);
                member.setRoleTestPlan(1);
                member.setAddedAt(LocalDateTime.now());
                memberRepository.save(member);
                List<MemberDTO> memberDTOS = testPlanDTO.getMembers();
                for (MemberDTO memberDTO : memberDTOS) {
                    memberDTO.setAddBy(testPlanDTO.getCreatedBy());
                    memberService.saveMemberTestPlan(memberDTO, testPlan.getTestPlanId());
                }
                /*Upload file*/
                saveTestPlanAvatar(uploadKey, testPlan);
                testPlanDTO = modelMapper.map(testPlan, TestPlanDTO.class);
                return testPlanDTO;
            } else {
                /*Update test plan info*/
                testPlan = testPlanRepository.getTestPlanById(id);
                return updateTestPlan(testPlanDTO, testPlan, uploadKey, id);
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to save test plan", testPlanDTO);
        }
    }

    private TestPlanDTO updateTestPlan(TestPlanDTO testPlanDTO, TestPlan testPlan, String uploadKey, Long id) {
        if (testPlan != null) {
            testPlan.setUpdatedAt(LocalDateTime.now());
            if (testPlanDTO.getDescription() != null) {
                testPlan.setDescription(testPlanDTO.getDescription());
            }
            if (testPlanDTO.getTestPlanName() != null) {
                testPlan.setTestPlanName(testPlanDTO.getTestPlanName());
            }
            if (testPlanDTO.getStartDate() != null) {
                testPlan.setStartDate(testPlanDTO.getStartDate());
            }
            if (testPlanDTO.getEndDate() != null) {
                testPlan.setEndDate(testPlanDTO.getEndDate());
            }
            if (testPlanDTO.getStatus() != null) {
                testPlan.setStatus(testPlanDTO.getStatus());
            }
            testPlan = testPlanRepository.save(testPlan);
            /*Upload file*/
            saveTestPlanAvatar(uploadKey, testPlan);
            return modelMapper.map(testPlan, TestPlanDTO.class);
        } else {
            throw new ResourceNotFoundException("TestPlan not found", "TestPlanId: ", id);
        }
    }

    private boolean checkRoleOwnerBeforeUpdate(List<MemberDTO> memberDTOS) {
        int countRoleOwner = 0;
        for (MemberDTO memberDTO : memberDTOS) {
            if (memberDTO.getRoleTestPlan() == 1) {
                countRoleOwner++;
                if (countRoleOwner > 1) {
                    return false;
                }
            }
        }
        return countRoleOwner == 1;
    }

    @Override
    public List<MemberDTO> saveMember(Long testPlanId, List<MemberDTO> memberDTOS) {
        try {
            String userId = TokenUtils.getUserID();
            if (getRoleInTestPlan(userId.trim(), testPlanId) == 1) {
                if (!checkRoleOwnerBeforeUpdate(memberDTOS))
                    throw new IllegalArgumentException("A test plan can only have 1 owner.");

                List<Member> oldMembers = memberRepository.getMemberByTestPlanId(testPlanId);
                List<Long> inputMemberIds = memberDTOS.stream().map(x -> x.getMemberId()).filter(Objects::nonNull).toList();
                List<Long> memberIdsDel = oldMembers.stream().map(x -> {
                    if (!inputMemberIds.contains(x.getMemberId())) {
                        return x.getMemberId();
                    }
                    return null;
                }).filter(Objects::nonNull).toList();
                memberService.deleteMembersWithoutOwner(memberIdsDel);
                List<MemberDTO> rs = new ArrayList<>();
                for (MemberDTO memberDTO : memberDTOS) {
                    if (memberDTO.getRoleTestPlan() == 1 && !memberDTO.getUserId().equals(userId)) {
                        sendPrivateNotifyForOwnerRoleChange(memberDTO, userId.trim(), testPlanId);
                    }
                    MemberDTO tmp = memberService.saveMemberTestPlan(memberDTO, testPlanId);
                    rs.add(tmp);
                }

                updateTestPlanUpdateTime(testPlanId);

                return rs;
            }
            return null;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to add member: ", testPlanId);
        }
    }

    private void sendPrivateNotifyForOwnerRoleChange(MemberDTO memberDTO, String oldOwnerId, Long testPlanId) {
        if (testPlanRepository.existsById(testPlanId)) {
            String testPlanName = testPlanRepository.getTestPlanById(testPlanId).getTestPlanName();
            String oldOwnerName = usersService.findUserById(oldOwnerId).getFullName();

            Notify notify = new Notify();
            notify.setLink("/test-plan/plan-information/" + testPlanId);
            notify.setUserId(memberDTO.getUserId());
            notify.setSenderId(oldOwnerId);
            notify.setNotifyContent(String.format(Constant.changeRoleToOwnerEN, testPlanName, oldOwnerName));

            /*Check notify setting*/
            String notifySetting = memberSettingRepository.getNotifySettingByUserIdAndTestPlanId(memberDTO.getUserId(), testPlanId);
            String mailSetting = memberSettingRepository.getMailSettingByUserIdAndTestPlanId(memberDTO.getUserId(), testPlanId);
            if (notifySetting != null && notifySetting.contains("1")) {
                notifyService.save(notify);
                notificationService.sendPrivateNotification(String.valueOf(memberDTO.getUserId()), notify.getNotifyContent());
            }
            if (mailSetting != null && mailSetting.contains("1")) {
                sendMail(memberDTO.getUserId(), notify.getNotifyContent(), notify.getLink());
            }
        } else {
            throw new ResourceNotFoundException("", "Test plan does not exists: ", testPlanId);
        }
    }

    private void disableTestPlan(Long testPlanId, Integer status) {
        try {
            String userId = TokenUtils.getUserID();
            if (getRoleInTestPlan(userId.trim(), testPlanId) == 1) {
                if (testPlanRepository.existsById(testPlanId)) {
                    testPlanRepository.disableTestPlan(testPlanId, status);
                    TestPlan testPlan = testPlanRepository.getTestPlanById(testPlanId);
                    List<Member> members = memberRepository.getMemberByTestPlanId(testPlanId);
                    for (Member member : members) {
                        if (!userId.equals(member.getUserId())) {
                            Notify notify = new Notify();
                            notify.setLink("/test-plan/plan-information/" + testPlanId);
                            notify.setUserId(member.getUserId());
                            notify.setSenderId(userId);
                            notify.setNotifyContent(String.format(Constant.changeStateProjectEN, testPlan.getTestPlanName(), testPlan.getStatus() == 1 ? "Active" : "Archived"));
                            /*Check notify setting*/
                            String notifySetting = memberSettingRepository.getNotifySettingByUserIdAndTestPlanId(member.getUserId(), testPlanId);
                            String mailSetting = memberSettingRepository.getMailSettingByUserIdAndTestPlanId(member.getUserId(), testPlanId);
                            if (notifySetting != null && notifySetting.contains("1")) {
                                notifyService.save(notify);
                                notificationService.sendPrivateNotification(String.valueOf(member.getUserId()), notify.getNotifyContent());
                            }
                            if (mailSetting != null && mailSetting.contains("1")) {
                                sendMail(member.getUserId(), notify.getNotifyContent(), notify.getLink());
                            }
                        }
                    }
                } else {
                    throw new ResourceNotFoundException("", "Test plan does not exists: ", testPlanId);
                }
            } else {
                throw new ResourceNotFoundException("", "UserId is not has role in test plan: ", testPlanId);
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Disable test_plan fail: ", testPlanId);
        }
    }

    @Override
    public List<TestPlanDTO> disableTestPlans(List<TestPlanDTO> testPlanDTOs) {
        try {
            for (TestPlanDTO testPlanDTO : testPlanDTOs) {
                Long testPlanId = testPlanDTO.getTestPlanId();
                Integer status = testPlanDTO.getStatus();
                if (testPlanRepository.existsById(testPlanId)) {
                    disableTestPlan(testPlanId, status);
                }
            }
            return testPlanDTOs;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Disable test_plan fail: ", testPlanDTOs);
        }
    }

    @Override
    public TestPlanDTO pinTestPlan(Long testPlanId, String userId, Boolean isPin) {
        try {
            if (isPin) {
                TestPlan testPlan = testPlanRepository.getTestPlanById(testPlanId);
                Pin pin = new Pin();
                pin.setPinnedAt(LocalDateTime.now());
                pin.setTestPlan(testPlan);
                pin.setUserId(userId);
                pinRepository.save(pin);
            } else {
                Pin pin = pinRepository.getPinByTestPlanIdAndUserId(testPlanId, userId);
                if (pin != null) {
                    pinRepository.deleteById(pin.getPinId());
                }
            }
            TestPlanDTO testPlanDTO = new TestPlanDTO();
            testPlanDTO.setTestPlanId(testPlanId);
            testPlanDTO.setIsPin(isPin);
            return testPlanDTO;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Pin test_plan fail for testPlanId: ", testPlanId);
        }
    }

    @Override
    public MemberPage getMemberByTestPlanId(Long testPlanId, String name, String sorted, int page, int size) {
        String userId = TokenUtils.getUserID();
        if (getRoleInTestPlan(userId, testPlanId) > 0 && testPlanRepository.existsById(testPlanId)) {
            return memberService.getMemberByTestPlanId(testPlanId, name, sorted, page, size);
        }
        return new MemberPage();
    }

    @Override
    public MemberPage getMembersByTestPlanIdInEdit(Long testPlanId, String name) {
        String userId = TokenUtils.getUserID();
        if (getRoleInTestPlan(userId, testPlanId) > 0 && testPlanRepository.existsById(testPlanId)) {
            if (memberRepository.getMemberByTestPlanId(testPlanId) == null) return new MemberPage();
            int membersInTestPlan = memberRepository.getMemberByTestPlanId(testPlanId).size();
            return memberService.getMemberByTestPlanId(testPlanId, name, "", 0, membersInTestPlan);
        }
        return new MemberPage();
    }

    @Override
    public UserPage getCreator(String userId, String name, Integer page, Integer size) {
        try {
            /*Search by name from bzw*/
            if (name != null && !name.isEmpty()) {
                List<Users> users = usersService.getAllUser(userId, name);
                List<Users> rs = null;
                String authResponse = TokenUtils.getUserRole();
                if (authResponse.equals("ROLE_ADMIN")) {
                    rs = users.stream().map(x -> {
                        if (testPlanRepository.isExistsCreatorCreatedTestPlanHasUser(x.getUserID()) == 1) {
                            return x;
                        }
                        return null;
                    }).filter(Objects::nonNull).collect(Collectors.toList());
                } else {
                    rs = users.stream().map(x -> {
                        if (testPlanRepository.isExistsCreatorCreatedTestPlanHasUser(userId, x.getUserID()) == 1) {
                            return x;
                        }
                        return null;
                    }).filter(Objects::nonNull).collect(Collectors.toList());
                }
                return new UserPage(rs, new PageInfo());
            } else {
                Pageable pageable = PageRequest.of(page, size);
                Page<String> ids = null;
                String authResponse = TokenUtils.getUserRole();
                if (authResponse.equals("ROLE_ADMIN")) {
                    ids = testPlanRepository.getCreatorForAdmin(pageable);
                } else {
                    ids = testPlanRepository.getCreator(userId, pageable);
                }
                List<Users> users = ids.stream().map(usersService::findUserById).filter(Objects::nonNull).collect(Collectors.toList());
                PageInfo pageInfo = new PageInfo(ids.getTotalPages(), (int) ids.getTotalElements(), ids.getNumber(), ids.getSize());
                return new UserPage(users, pageInfo);
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get created test plan by userId: ", userId);
        }
    }

    @Override
    public Integer getRoleInTestPlan(String userId, Long testPlanId) {
        try {
            if (testPlanRepository.existsById(testPlanId)) {
                String authResponse = TokenUtils.getUserRole();
                if (authResponse.equals("ROLE_ADMIN")) {
                    return 1;
                }
                return testPlanRepository.getRoleInTestPlan(userId, testPlanId);
            }
            return -1;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get role in test plan by userId: ", userId);
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

    private void saveTestPlanAvatar(String uploadKey, TestPlan testPlan) {
        if (StringUtils.isNotEmpty(uploadKey)) {
            String groupId = String.format("%s-%s", testPlan.getClass().getSimpleName(), ((BaseEntity) testPlan).getSeq());
            fileService.updateGroupId(uploadKey, groupId);
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

    private void createDefaultIssuesLabels(TestPlan testPlan) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        try {
            executor.execute(() -> {
                createLabel(testPlan, "Unit Test", "#D1FFF7", 1);
                createLabel(testPlan, "Integration Test", "#C8E8FF", 1);
                createLabel(testPlan, "Regression Test", "#E6E6E6", 1);
                createLabel(testPlan, "Bug", "#FFD9D9", 2);
                createLabel(testPlan, "Feature Request", "#EBFFDB", 2);
                createLabel(testPlan, "Enhancement", "#FFF2DE", 2);
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

    private void createLabel(TestPlan testPlan, String labelName, String labelColor, Integer labelType) {
        Label label = new Label();
        label.setLabelName(labelName);
        label.setLabelColor(labelColor);
        label.setLabelType(labelType);
        label.setTestPlan(testPlan);
        labelRepository.save(label);
    }

    private void updateTestPlanUpdateTime(Long testPlanId) {
        TestPlan testPlan = testPlanRepository.getTestPlanById(testPlanId);
        testPlan.setUpdatedAt(LocalDateTime.now());
        testPlanRepository.save(testPlan);
    }
}
