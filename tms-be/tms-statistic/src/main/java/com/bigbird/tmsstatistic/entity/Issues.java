package com.tms_statistic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms_statistic.cmmn.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "issues")
public class Issues extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "issues_id", nullable = false)
    private Long issuesId;

    @Column(name = "issues_name", nullable = false)
    private String issuesName;

    @Column(name = "created_by")
    private String createdBy;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "test_plan_id", nullable = false)
    private TestPlan testPlan;

    /*
     * 1: LOW
     * 2: MEDIUM
     * 3: HIGH
     * */
    @Column(name = "priority")
    private Integer priority;

    /*
     * 1: Unresolved
     * 2: Resolved
     * 3: Non-issue
     * */
    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "scope", nullable = false)
    private String scope;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "description", columnDefinition = "LONGTEXT", nullable = false)
    private String description;

    @Column(name = "note")
    private String note;

    @Override
    public Long getSeq() {
        return this.issuesId;
    }
}
