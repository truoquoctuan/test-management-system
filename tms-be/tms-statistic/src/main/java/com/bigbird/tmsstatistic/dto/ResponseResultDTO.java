package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseResultDTO {
    private Long id;
    private List<TestResultDTO> data;
}
