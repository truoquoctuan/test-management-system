package com.bigbird.tmsrepo.service.Impl;

import com.bigbird.tmsrepo.cmmn.base.PageInfo;
import com.bigbird.tmsrepo.cmmn.exception.ResourceNotFoundException;
import com.bigbird.tmsrepo.cmmn.util.Constant;
import com.bigbird.tmsrepo.dto.MemberDTO;
import com.bigbird.tmsrepo.dto.MemberPage;
import com.bigbird.tmsrepo.dto.PositionDTO;
import com.bigbird.tmsrepo.entity.*;
import com.bigbird.tmsrepo.repository.*;
import com.bigbird.tmsrepo.service.MailService;
import com.bigbird.tmsrepo.service.MemberService;
import com.bigbird.tmsrepo.service.UsersService;
import com.bigbird.tmsrepo.socket.NotificationService;
import com.bigbird.tmsrepo.socket.Notify;
import com.bigbird.tmsrepo.socket.NotifyService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final PositionRepository positionRepository;
    private final MemberPositionRepository memberPositionRepository;
    private final ModelMapper modelMapper;
    private final TestPlanRepository testPlanRepository;
    private final UsersService usersService;
    private final NotifyService notifyService;
    private final NotificationService notificationService;
    private final MailService mailService;
    private final MemberSettingRepository memberSettingRepository;

    @Override
    public MemberPage getMemberByTestPlanId(Long testPlanId, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            return getMemberPage(testPlanId, pageable);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Get member page by testPlanId: ", testPlanId);
        }
    }

    @Override
    public MemberPage getMemberByTestPlanId(Long testPlanId, String name, String sorted, int page, int size) {
        try {
            if (name != null && !name.trim().isEmpty()) {
                List<Users> users = usersService.getAllUser("", name);
                if (users != null && !users.isEmpty()) {
                    List<String> userIds = users.stream().map(Users::getUserID).toList();
                    Pageable pageable = PageRequest.of(page, size);
                    Page<Member> memberPage = memberRepository.getMemberByTestPlanIdAndUserIds(testPlanId, userIds, pageable);
                    List<Member> members = memberPage.getContent();
                    List<MemberDTO> memberDTOS = getMemberAndPosition(members, name);
                    PageInfo pageInfo = new PageInfo(memberPage.getTotalPages(), (int) memberPage.getTotalElements(), memberPage.getNumber(), memberPage.getSize());
                    return new MemberPage(memberDTOS, pageInfo);
                }
                return null;
            }
            Pageable pageable = PageRequest.of(page, size, parseSortString(sorted));
            return getMemberPage(testPlanId, pageable);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Get member page by testPlanId: ", testPlanId);
        }
    }

    @Override
    public MemberDTO saveMemberTestPlan(MemberDTO memberDTO, Long testPlanId) {
        try {
//            Member memberExists = memberRepository.getMemberByTestPlanIdAndUserId(testPlanId, memberDTO.getUserId());
//            if (memberExists != null) {
//                throw new ResourceNotFoundException("", "Member exits in test_plan: ", memberDTO);
//            } else {
                Notify notify = new Notify();
                Member member = modelMapper.map(memberDTO, Member.class);
                TestPlan testPlan = testPlanRepository.getTestPlanById(testPlanId);
                Long memberId = member.getMemberId();
                if (memberId != null) {
                    /* Update member */
                    memberPositionRepository.deleteMemberPositionByMemberId(memberId);
                    Member old = memberRepository.getMemberByMemberId(memberId);
                    member.setAddBy(old.getAddBy());
                    member.setAddedAt(old.getAddedAt());
                } else {
                    /* Add new member */
                    member.setAddedAt(LocalDateTime.now());
                    setDefaultNotifySetting(member.getUserId(), testPlan);
                }
                member.setTestPlan(testPlan);
                member = memberRepository.save(member);
                if (memberId == null) {
                    /* Send notify */
                    notify.setUserId(member.getUserId());
                    notify.setSenderId(member.getAddBy());
                    notify.setLink("/test-plan/plan-information/" + testPlanId);
                    notify.setNotifyContent(String.format(Constant.addMemberInProjectEN, testPlan.getTestPlanName(), usersService.findUserById(member.getAddBy()).getFullName()));
                    notifyService.save(notify);
                    notificationService.sendPrivateNotification(String.valueOf(notify.getUserId()), notify.getNotifyContent());
                    sendMail(notify.getUserId(), notify.getNotifyContent(), notify.getLink());
                }
                /* Set position */
                List<PositionDTO> positionDTOS = memberDTO.getPositions();
                setPositionForMember(positionDTOS, member);
                return memberDTO;
//            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Add member to test_plan: ", memberDTO);
        }
    }

    private void setPositionForMember(List<PositionDTO> positionDTOS, Member member) {
        if (!positionDTOS.isEmpty()) {
            for (PositionDTO positionDTO : positionDTOS) {
                Position position = positionRepository.getPositionById(positionDTO.getPositionId());
                MemberPosition memberPosition = new MemberPosition();
                memberPosition.setMember(member);
                memberPosition.setPosition(position);
                memberPositionRepository.save(memberPosition);
            }
        }
    }

    @Override
    public void deleteMembers(List<Long> memberIds) {
        try {
            for (Long memberId : memberIds) {
                if (memberRepository.existsById(memberId)) {
                    memberPositionRepository.deleteMemberPositionByMemberId(memberId);
                    memberRepository.deleteMemberOnTestPlanId(memberId);
                }
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Delete member by memberIds: ", memberIds);
        }
    }

    @Override
    public void deleteMembersWithoutOwner(List<Long> memberIds) {
        try {
            for (Long memberId : memberIds) {
                Member member = memberRepository.getMemberByMemberId(memberId);
                if (member != null && member.getRoleTestPlan() != 1) {
                    memberPositionRepository.deleteMemberPositionByMemberId(memberId);
                    memberRepository.deleteMemberOnTestPlanId(memberId);
                }
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Delete member without owner by memberIds: ", memberIds);
        }
    }

    private List<MemberDTO> getMemberAndPosition(List<Member> members) {
        List<MemberDTO> memberDTOS = new ArrayList<>();
        for (Member member : members) {
            Users users = usersService.findUserById(member.getUserId());
            if (users != null) {
                getMemberInfo(memberDTOS, member, users);
            }
        }
        return memberDTOS;
    }

    private List<MemberDTO> getMemberAndPosition(List<Member> members, String name) {
        List<MemberDTO> memberDTOS = new ArrayList<>();
        for (Member member : members) {
            Users users = usersService.findUserById(member.getUserId());
            if (users.getUserName().toLowerCase().contains(name.toLowerCase()) || users.getFullName().toLowerCase().contains(name.toLowerCase())) {
                getMemberInfo(memberDTOS, member, users);
            }
        }
        return memberDTOS;
    }

    /*Get member info*/
    private void getMemberInfo(List<MemberDTO> memberDTOS, Member member, Users users) {
        Users adder = new Users();
        if (member.getAddBy() != null) {
            adder = usersService.findUserDisabledById(member.getAddBy());
        }
        List<MemberPosition> memberPositions = memberPositionRepository.getMemberPositionByMemberId(member.getMemberId());
        List<PositionDTO> positions = new ArrayList<>();
        for (MemberPosition memberPosition : memberPositions) {
            Position position = positionRepository.getPositionById(memberPosition.getPosition().getPositionId());
            positions.add(modelMapper.map(position, PositionDTO.class));
        }
        MemberDTO memberDTO = modelMapper.map(member, MemberDTO.class);
        memberDTO.setPositions(positions);
        memberDTO.setUserInfo(users);
        if (adder != null) {
            memberDTO.setAdderInfo(adder);
        }
        memberDTOS.add(memberDTO);
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

    private MemberPage getMemberPage(Long testPlanId, Pageable pageable) {
        Page<Member> memberPage = memberRepository.getMemberByTestPlanId(testPlanId, pageable);
        List<Member> members = memberPage.getContent();
        List<MemberDTO> memberDTOS = getMemberAndPosition(members);
        PageInfo pageInfo = new PageInfo(memberPage.getTotalPages(), (int) memberPage.getTotalElements(), memberPage.getNumber(), memberPage.getSize());
        return new MemberPage(memberDTOS, pageInfo);
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


    private void setDefaultNotifySetting(String userId, TestPlan testPlan) {
        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            try {
                executor.execute(() -> {
                    MemberSetting memberSetting = memberSettingRepository.getMemberSettingByUserIdAndTestPlanId(userId, testPlan.getTestPlanId());
                    if (memberSetting == null) {
                        memberSetting = new MemberSetting();
                        memberSetting.setUserId(userId);
                        memberSetting.setTestPlan(testPlan);
                        memberSetting.setMailSetting("3, 5, 6");
                        memberSetting.setNotifySetting("3, 5, 6");
                        memberSettingRepository.save(memberSetting);
                    }
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
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not get mail setting by userId: ", userId);
        }
    }
}
