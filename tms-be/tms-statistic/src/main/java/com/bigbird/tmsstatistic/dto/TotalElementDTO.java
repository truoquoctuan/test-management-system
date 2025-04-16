package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TotalElementDTO {
    private Long totalFolders;
    private Long totalTestCases;
    private Long testCasesWithResults;
    private Long testCasesWithoutResults;
}
