package com.tms_statistic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "test_case_issues")
public class TestCaseIssues {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_case_issues_id")
    private Long testCaseIssuesId;
    @Column(name = "test_case_id")
    private Long testCaseId;
    @Column(name = "issues_id")
    private Long issuesId;
}
