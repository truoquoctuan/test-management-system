package com.bigbird.tmsrepo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "member_setting")
public class MemberSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_setting_id")
    private Long memberSettingId;

    @Column(name = "user_id", columnDefinition = "VARCHAR(36)")
    private String userId;

    @ManyToOne
    @JoinColumn(name = "test_plan_id")
    private TestPlan testPlan;

    /**
     * Chuỗi string chứa id chỉ danh các setting
     * 1: test plan status update
     * 2: added to test plan (bỏ)
     * 3: assign to test case
     * 4: tagged in comment
     * 5: assign to issue
     * 6: issue status update
     */
    @Column(name = "mail_setting")
    private String mailSetting;

    @Column(name = "notify_setting")
    private String notifySetting;
}
