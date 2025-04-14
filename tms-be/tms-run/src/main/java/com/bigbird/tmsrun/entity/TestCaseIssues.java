package com.tms_run.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "test_case_issues")
public class TestCaseIssues {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_case_issues_id")
    private Long testCaseIssuesId;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "test_case_id")
    private TestCase testCase;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "issues_id")
    private Issues issues;
}
