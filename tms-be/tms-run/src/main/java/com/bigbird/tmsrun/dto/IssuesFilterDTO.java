package com.tms_run.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssuesFilterDTO {
    private Long testPlanId;
    private List<Long> issuesIds;
    private String issuesName;
    private List<String> assignIds;
    private List<Long> testCaseIds;
    private List<Integer> priorities;
    private List<Long> tags;
    private List<Integer> status;
    private String dueDate;
    private Boolean exactFilterMatch;
}
