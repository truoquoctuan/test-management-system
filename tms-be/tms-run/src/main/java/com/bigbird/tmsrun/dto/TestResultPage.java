package com.tms_run.dto;

import com.tms_run.cmmn.base.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TestResultPage {

    private List<TestResultDTO> testResults;

    private PageInfo pageInfo;
}
