package com.bigbird.tmsrepo.entity;

import com.bigbird.tmsrepo.cmmn.base.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "test_plan")
public class TestPlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_plan_id")
    private Long testPlanId;

    @Column(name = "test_plan_name", nullable = false)
    private String testPlanName;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    /**
     * 1: active
     * 0: archive
     */
    @Column(name = "status", columnDefinition = "int(1) default(1)")
    private Integer status;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "created_by", nullable = false, columnDefinition = "VARCHAR(36)")
    private String createdBy;

    @OneToMany(mappedBy = "testPlan", cascade = CascadeType.ALL)
    private List<Member> members = new ArrayList<>();

    @OneToMany(mappedBy = "testPlan", cascade = CascadeType.ALL)
    private List<Folder> folders = new ArrayList<>();

    @OneToMany(mappedBy = "testPlan", cascade = CascadeType.ALL)
    private List<Label> labels = new ArrayList<>();

    @OneToMany(mappedBy = "testPlan", cascade = CascadeType.ALL)
    private List<Pin> pins = new ArrayList<>();

    @OneToMany(mappedBy = "testPlan", cascade = CascadeType.ALL)
    private List<MemberSetting> memberSettings = new ArrayList<>();

    @Override
    public Long getSeq() {
        return this.testPlanId;
    }

}
