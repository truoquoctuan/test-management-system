package com.tms_statistic.dto;

import com.tms_statistic.entity.TestPlan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssuesDTO {
    private Long issuesId;
    private String issuesName;
    private Long testPlanId;
    private TestPlan testPlan;
    private String userId;
    private String assignIds;
    private String assignUsers;
    private String labels;
    private Integer priority;
    private String scope;
    private Integer status;
    private String testCaseSelection;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String description;
    private String note;
    private String uploadKey;
    private String cause;
    private String solution;

}
