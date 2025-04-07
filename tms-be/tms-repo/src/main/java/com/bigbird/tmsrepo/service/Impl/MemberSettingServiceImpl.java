package com.bigbird.tmsrepo.service.Impl;

import com.bigbird.tmsrepo.cmmn.exception.ResourceNotFoundException;
import com.bigbird.tmsrepo.entity.MemberSetting;
import com.bigbird.tmsrepo.entity.TestPlan;
import com.bigbird.tmsrepo.repository.MemberSettingRepository;
import com.bigbird.tmsrepo.repository.TestPlanRepository;
import com.bigbird.tmsrepo.service.MemberSettingService;
import com.bigbird.tmsrepo.service.TestPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberSettingServiceImpl implements MemberSettingService {

    private final MemberSettingRepository memberSettingRepository;
    private final TestPlanRepository testPlanRepository;
    private final TestPlanService testPlanService;

    @Override
    public String getNotifySetting(String userId, Long testPlanId) {
        try {
            return memberSettingRepository.getNotifySettingByUserIdAndTestPlanId(userId, testPlanId);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not get notify setting by userId: ", userId);
        }
    }

    @Override
    public String getMailSetting(String userId, Long testPlanId) {
        try {
            return memberSettingRepository.getMailSettingByUserIdAndTestPlanId(userId, testPlanId);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not get mail setting by userId: ", userId);
        }
    }

    @Override
    public String setNotifySetting(String userId, Long testPlanId, String notifySetting) {
        try {
            if (testPlanService.getRoleInTestPlan(userId, testPlanId) != null) {
                saveMemberSetting(userId, testPlanId);
                memberSettingRepository.setNotifySettingByUserIdAndTestPlanId(userId, testPlanId, notifySetting);
            }
            return memberSettingRepository.getMailSettingByUserIdAndTestPlanId(userId, testPlanId);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not get mail setting by userId: ", userId);
        }
    }

    @Override
    public String setMailSetting(String userId, Long testPlanId, String mailSetting) {
        try {
            if (testPlanService.getRoleInTestPlan(userId, testPlanId) != null) {
                saveMemberSetting(userId, testPlanId);
                memberSettingRepository.setMailSettingByUserIdAndTestPlanId(userId, testPlanId, mailSetting);
            }
            return memberSettingRepository.getMailSettingByUserIdAndTestPlanId(userId, testPlanId);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not get mail setting by userId: ", userId);
        }
    }

    private void saveMemberSetting(String userId, Long testPlanId) {
        MemberSetting memberSetting = memberSettingRepository.getMemberSettingByUserIdAndTestPlanId(userId, testPlanId);
        if (memberSetting == null) {
            memberSetting = new MemberSetting();
            memberSetting.setUserId(userId);
            TestPlan testPlan = testPlanRepository.getTestPlanById(testPlanId);
            memberSetting.setTestPlan(testPlan);
            memberSettingRepository.save(memberSetting);
        }
    }
}
