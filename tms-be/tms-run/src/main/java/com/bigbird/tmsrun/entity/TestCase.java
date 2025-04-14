package com.tms_run.entity;

import com.tms_run.cmmn.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "test_case")
public class TestCase extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_case_id")
    private Long testCaseId;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "expect_result", columnDefinition = "LONGTEXT")
    private String expectResult;

    /**
     * 1: low
     * 2: normal
     * 3: high
     */
    @Column(name = "priority")
    private Integer priority;

    /**
     * 1: passed
     * 2: failed
     * 3: retest
     * 4: skipped
     * 5: untested
     */
    @Column(name = "status", columnDefinition = "int(1) default(5)")
    private Integer status;

    @Column(name = "test_case_name", nullable = false)
    private String testCaseName;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @Column(name = "file_seqs", nullable = false)
    private String fileSeqs;

    @OneToMany(mappedBy = "testCase", cascade = CascadeType.ALL)
    private List<TestResult> testResults = new ArrayList<>();

    @OneToMany(mappedBy = "testCase", cascade = CascadeType.ALL)
    private List<TestCaseIssues> testCase = new ArrayList<>();

    @Override
    public Long getSeq() {
        return this.testCaseId;
    }
}
