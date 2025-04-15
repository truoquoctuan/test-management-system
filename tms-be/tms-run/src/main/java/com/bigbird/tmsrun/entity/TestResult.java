package com.tms_run.entity;

import com.tms_run.cmmn.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "test_result")
public class TestResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_result_id")
    private Long testResultId;

    @Column(name = "content", nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    /**
     * 1: passed
     * 2: failed
     * 3: retest
     * 4: skipped
     * 5: untested
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * người tạo test result
     */
    @Column(name = "user_id")
    private String userId;

    @Column(name = "file_seqs", nullable = false)
    private String fileSeqs;

    @ManyToOne
    @JoinColumn(name = "test_case_id")
    private TestCase testCase;

    @Override
    public Long getSeq() {
        return this.testResultId;
    }
}
