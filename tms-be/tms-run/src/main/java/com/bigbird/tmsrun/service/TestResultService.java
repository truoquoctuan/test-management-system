package com.tms_run.service;

import com.tms_run.dto.TestResultDTO;
import com.tms_run.dto.TestResultPage;

import java.util.List;
import java.util.Optional;

public interface TestResultService {

    TestResultDTO createTestResult(TestResultDTO input);

    TestResultPage getTestResultById(Long id, int page, int size);
}
