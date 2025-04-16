package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TotalFolderDashboardDTO {
    private Long totalFolder;
    private Long totalStoppedFolder;
    private Long totalRanFolder;
}
