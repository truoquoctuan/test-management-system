package com.tms_statistic.dto;

import com.tms_statistic.cmmn.base.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestCasePage {
    private List<TestCaseDTO> testCases;

    private PageInfo pageInfo;

}
