package com.bigbird.tmsrepo.service;

public interface MemberSettingService {

    String getNotifySetting(String userId, Long testPlanId);

    String getMailSetting(String userId, Long testPlanId);

    String setNotifySetting(String userId, Long testPlanId, String notifySetting);

    String setMailSetting(String userId, Long testPlanId, String mailSetting);

}
