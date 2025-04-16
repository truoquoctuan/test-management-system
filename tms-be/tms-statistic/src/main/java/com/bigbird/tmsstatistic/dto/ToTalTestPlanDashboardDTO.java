package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ToTalTestPlanDashboardDTO {
    private Long totalTestPlan;
    private Long totalActiveTestPlan;
    private Long totalArchiveTestPlan;
}
