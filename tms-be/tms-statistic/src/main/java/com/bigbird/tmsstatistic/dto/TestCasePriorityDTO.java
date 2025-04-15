package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestCasePriorityDTO {
    private Integer priority;
    private Long count;
}
