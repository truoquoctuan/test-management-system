package com.tms_run.service;

import com.tms_run.dto.TestCasePage;

import java.util.List;

public interface TestCaseService {

    TestCasePage getAllTestCase(Long folderId, String searchString, List<String> createdBys, List<Long> labelIds, List<Integer> resultStatus, String sort, Integer page, Integer size);
}
