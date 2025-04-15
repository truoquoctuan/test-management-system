package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestPlanDTO {
    private Long testPlanId;
    private String testPlanName;
    private String description;
    private Integer status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<IssuesDTO> issues;
}
