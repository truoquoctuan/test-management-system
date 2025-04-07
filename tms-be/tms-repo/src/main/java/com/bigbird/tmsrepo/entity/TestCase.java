package com.bigbird.tmsrepo.entity;

import com.bigbird.tmsrepo.cmmn.base.BaseEntity;
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
     * 2: medium
     * 3: high
     */
    @Column(name = "priority")
    private Integer priority;

    @Column(name = "status")
    private Integer status;

    @Column(name = "test_case_name", nullable = false)
    private String testCaseName;

    @Column(name = "created_by", nullable = false, columnDefinition = "VARCHAR(36)")
    private String createdBy;

    @Column(name = "file_seqs")
    private String fileSeqs;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @Override
    public Long getSeq() {
        return this.testCaseId;
    }

}
