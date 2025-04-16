package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TotalTestCaseDashboardDTO {
    private Long totalTestCase;
    private Long totalExecuteTestCase;
    private Long totalPendTestCase;
}
