package com.tms_run.controller;

import com.tms_run.dto.TestResultDTO;
import com.tms_run.dto.TestResultPage;
import com.tms_run.service.TestResultService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class TestResultController {

    private final TestResultService testResultService;

    public TestResultController(TestResultService testResultService) {
        this.testResultService = testResultService;
    }

    @QueryMapping
    public TestResultPage getTestResultById(@Argument Long id, @Argument int page, @Argument int size) {
        return testResultService.getTestResultById(id, page, size);
    }

    @SchemaMapping(typeName = "Mutation", field = "createTestResult")
    public TestResultDTO createTestResult(@Argument TestResultDTO input) {
        return testResultService.createTestResult(input);
    }
}
