package com.tms_statistic.dto;

import com.tms_statistic.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestCaseDTO {
    private Long testCaseId;

    private String testCaseName;

    private Integer priority;

    private Integer status;

    private String createdBy;

    private Long folderId;

    private String description;

    private String expectResult;

    private Integer resultStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Users users;

    private List<LabelDTO> labelsInfo;

    private TestResultDTO lastTestResult;

    public TestCaseDTO(Long testCaseId, String testCaseName, Integer priority, Integer status, String createdBy, Long folderId, Integer resultStatus, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.testCaseId = testCaseId;
        this.testCaseName = testCaseName;
        this.priority = priority;
        this.status = status;
        this.createdBy = createdBy;
        this.folderId = folderId;
        this.resultStatus = resultStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public TestCaseDTO(Long testCaseId, String testCaseName, Integer priority, Integer status, String createdBy, Long folderId, String description, String expectResult, Integer resultStatus, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.testCaseId = testCaseId;
        this.testCaseName = testCaseName;
        this.priority = priority;
        this.status = status;
        this.createdBy = createdBy;
        this.folderId = folderId;
        this.resultStatus = resultStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.description = description;
        this.expectResult = expectResult;
    }

}
