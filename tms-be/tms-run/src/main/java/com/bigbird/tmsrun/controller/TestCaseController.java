package com.tms_run.controller;

import com.tms_run.dto.TestCasePage;
import com.tms_run.service.TestCaseService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestCaseController {

    private final TestCaseService testCaseService;

    public TestCaseController(TestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @QueryMapping
    public TestCasePage getAllTestCase(@Argument Long folderId, @Argument String searchString, @Argument List<String> createdBys, @Argument List<Long> labelIds, @Argument List<Integer> resultStatus, @Argument String sort, @Argument Integer page, @Argument Integer size) {
        return testCaseService.getAllTestCase(folderId, searchString, createdBys, labelIds, resultStatus, sort, page, size);
    }
}
