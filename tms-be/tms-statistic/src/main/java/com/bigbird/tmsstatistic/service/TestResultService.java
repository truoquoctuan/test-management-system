package com.tms_statistic.service;

import com.tms_statistic.dto.TestResultDTO;

import java.util.List;

public interface TestResultService {
    List<TestResultDTO> getTestResultByTestCaseId(Long testCaseId);

    TestResultDTO getLastTestResultByTestCaseId(Long testCaseId);
}
