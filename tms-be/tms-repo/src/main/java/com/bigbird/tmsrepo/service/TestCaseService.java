package com.bigbird.tmsrepo.service;

import com.bigbird.tmsrepo.dto.StatusDTO;
import com.bigbird.tmsrepo.dto.TestCaseDTO;
import com.bigbird.tmsrepo.dto.TestCasePage;

import java.util.List;
import java.util.Optional;

public interface TestCaseService {

    TestCaseDTO createTestCase(TestCaseDTO input);

    void createTestCases(Long folderId, List<TestCaseDTO> testCases);

    TestCaseDTO updateTestCaseById(TestCaseDTO input);

    StatusDTO deleteTestCaseById(List<Long> ids);

    Optional<TestCaseDTO> getTestCaseById(Long id);

    StatusDTO updateLabelInTestCase(Long labelId, Long testCaseId, String flag);

    TestCasePage getAll(Long folderId, String testCaseName, List<String> createdBys, List<Long> labelIds, String sorted, Integer page, Integer size);

    TestCasePage getAllTestCaseByTestPlanIdWithSearch(Long testCaseId, String testCaseName, Long testPlanId, Integer page, Integer size);
}
