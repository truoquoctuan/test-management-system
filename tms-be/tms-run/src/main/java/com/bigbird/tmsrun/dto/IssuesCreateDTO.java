package com.tms_run.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssuesCreateDTO {
    @NotNull
    private Long issuesId;
    @NotNull
    @Size(max = 255, message = "Maximum length is 255 characters")
    private String issuesName;
    private Long testPlanId;
    private String createdBy;
    private String assignIds;
    private String labels;
    private Integer priority;
    @Size(max = 255, message = "Maximum length is 255 characters")
    private String scope;
    private Integer status;
    private String testCaseSelection;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @Size(max = 10000, message = "Maximum length is 10000 characters")
    private String description;
    @Size(max = 255, message = "Maximum length is 255 characters")
    private String note;
    private String uploadKey;
}
