package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.MemberSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface MemberSettingRepository extends JpaRepository<MemberSetting, Long> {
    @Query("select m.notifySetting from MemberSetting m where m.userId = :userId and m.testPlan.testPlanId = :testPlanId")
    String getNotifySettingByUserIdAndTestPlanId(String userId, Long testPlanId);

    @Query("select m.mailSetting from MemberSetting m where m.userId = :userId and m.testPlan.testPlanId = :testPlanId")
    String getMailSettingByUserIdAndTestPlanId(String userId, Long testPlanId);

    @Modifying
    @Transactional
    @Query("update MemberSetting m set m.notifySetting = :notifySetting where m.userId = :userId and m.testPlan.testPlanId = :testPlanId")
    void setNotifySettingByUserIdAndTestPlanId(String userId, Long testPlanId, String notifySetting);

    @Modifying
    @Transactional
    @Query("update MemberSetting m set m.mailSetting = :mailSetting where m.userId = :userId and m.testPlan.testPlanId = :testPlanId")
    void setMailSettingByUserIdAndTestPlanId(String userId, Long testPlanId, String mailSetting);

    @Query("select m from MemberSetting m where m.userId = :userId and m.testPlan.testPlanId = :testPlanId")
    MemberSetting getMemberSettingByUserIdAndTestPlanId(String userId, Long testPlanId);

}
