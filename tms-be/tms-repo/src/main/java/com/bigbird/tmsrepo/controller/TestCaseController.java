package com.bigbird.tmsrepo.controller;

import com.bigbird.tmsrepo.dto.StatusDTO;
import com.bigbird.tmsrepo.dto.TestCaseDTO;
import com.bigbird.tmsrepo.dto.TestCasePage;
import com.bigbird.tmsrepo.service.TestCaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
public class TestCaseController {

    private final TestCaseService testCaseService;

    public TestCaseController(TestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @QueryMapping
    public Optional<TestCaseDTO> getTestCaseById(@Argument Long id) {
        return testCaseService.getTestCaseById(id);
    }

    @SchemaMapping(typeName = "Mutation", field = "createTestCase")
    public TestCaseDTO createTestCase(@Argument TestCaseDTO input) {
        return testCaseService.createTestCase(input);
    }

    @SchemaMapping(typeName = "Mutation", field = "createTestCases")
    public String createTestCases(@Argument Long folderId, @Argument List<TestCaseDTO> testCases) {
        testCaseService.createTestCases(folderId, testCases);
        return "Successfully";
    }

    @SchemaMapping(typeName = "Mutation", field = "updateTestCaseById")
    public TestCaseDTO updateTestCaseById(@Argument TestCaseDTO input) {
        return testCaseService.updateTestCaseById(input);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteTestCaseById")
    public StatusDTO deleteTestCaseById(@Argument List<Long> ids) {
        return testCaseService.deleteTestCaseById(ids);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateLabelInTestCase")
    public StatusDTO updateLabelInTestCase(@Argument Long labelId, @Argument Long testCaseId, @Argument String flag) {
        return testCaseService.updateLabelInTestCase(labelId, testCaseId, flag);
    }

    @SchemaMapping(typeName = "Query", field = "getAllTestCase")
    public TestCasePage getAllTestCase(@Argument Long folderId, @Argument String testCaseName, @Argument List<String> createdBys, @Argument List<Long> labelIds, @Argument String sorted, @Argument Integer page, @Argument Integer size) {
        log.info("get all test case");
        return testCaseService.getAll(folderId, testCaseName, createdBys, labelIds, sorted, page, size);
    }

    @SchemaMapping(typeName = "Query", field = "getAllTestCaseByTestPlanIdWithSearch")
    public TestCasePage getAllTestCaseByTestPlanIdWithSearch(@Argument Long testCaseId, @Argument String testCaseName, @Argument Long testPlanId, @Argument int page, @Argument int size) {
        return testCaseService.getAllTestCaseByTestPlanIdWithSearch(testCaseId, testCaseName, testPlanId, page, size);
    }
}
