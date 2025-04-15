package com.tms_run.dto;

import com.tms_run.entity.TestPlan;
import com.tms_run.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssuesDTO {
    private Long issuesId;
    private String issuesName;
    private TestPlan testPlan;
    private String createdBy;
    private List<LabelDTO> labelsList;
    private Integer priority;
    private String scope;
    private Integer status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String description;
    private String note;
    private List<AttachFileDTO> files;
    private String uploadKey;
    private List<Users> users;
    private Users creator;
    private List<TestCaseDTO> testCases;

}
