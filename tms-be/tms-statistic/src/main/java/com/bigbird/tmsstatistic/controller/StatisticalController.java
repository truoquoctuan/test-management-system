package com.tms_statistic.controller;

import com.tms_statistic.dto.*;
import com.tms_statistic.entity.AttachFile;
import com.tms_statistic.service.StatisticalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class StatisticalController {
    private final StatisticalService statisticalService;

    @SchemaMapping(typeName = "Query", field = "getTotalElementByTestPlanId")
    public TotalElementDTO getTotalElementByTestPlanId(@Argument Long testPlanId) {
        return statisticalService.getTotalElementByTestPlanId(testPlanId);
    }

    @SchemaMapping(typeName = "Query", field = "getTestCaseStatus")
    public List<TestCaseStatusDTO> getTestCaseStatus(@Argument Long testPlanId) {
        return statisticalService.getTestCaseStatusByTestPlanId(testPlanId);
    }

    @SchemaMapping(typeName = "Query", field = "getTestCasePriority")
    public List<TestCasePriorityDTO> getTestCasePriority(@Argument Long testPlanId) {
        return statisticalService.getTestCasePriorityByTestPlanId(testPlanId);
    }

    @SchemaMapping(typeName = "Query", field = "getTestCaseInFolder")
    public TestCasePage getTestCaseInFolder(@Argument Long folderId, @Argument String name, @Argument List<Integer> status, @Argument String sorted, @Argument Integer page, @Argument Integer size) {
        return statisticalService.getAllTestCaseByFolderId(folderId, name, status, sorted, page, size);
    }

    @SchemaMapping(typeName = "Query", field = "getAllFolderAndTestCaseResult")
    public List<FolderDTO> getAllFolderAndTestCaseResult(@Argument Long testPlanId) {
        return statisticalService.getAllFolderHasTestCaseResultByTestPlanId(testPlanId);
    }

    @SchemaMapping(typeName = "Query", field = "getTestCaseInTestPlan")
    public TestCasePage getTestCaseInTestPlan(@Argument Long testPlanId, @Argument Integer page, @Argument Integer size) {
        return statisticalService.getTestCaseInTestPlan(testPlanId, page, size);
    }

    @SchemaMapping(typeName = "Query", field = "generateCSV")
    public AttachFile generateCSV(@Argument Long testPlanId, @Argument String uploadKey, @Argument String name, @Argument Integer chunk, @Argument Integer chunks) {
        return statisticalService.generateCSV(testPlanId, uploadKey, name, chunk, chunks);
    }

    @SchemaMapping(typeName = "Query", field = "getTotalFolderDashboard")
    public TotalFolderDashboardDTO getTotalFolderDashboard(@Argument String userId) {
        return statisticalService.getTotalFolderDashboard(userId);
    }

    @SchemaMapping(typeName = "Query", field = "getTotalTestCaseDashboard")
    public TotalTestCaseDashboardDTO getTotalTestCaseDashboard(@Argument String userId) {
        return statisticalService.getTotalTestCaseDashboard(userId);
    }

    @SchemaMapping(typeName = "Query", field = "getTestCaseStatusDashboard")
    public List<TestCaseStatusDTO> getTestCaseStatusDashboard(@Argument String userId) {
        return statisticalService.getTestCaseStatusDashboard(userId);
    }

    @SchemaMapping(typeName = "Query", field = "getTestCasePriorityDashboard")
    public List<TestCasePriorityDTO> getTestCasePriorityDashboard(@Argument String userId) {
        return statisticalService.getTestCasePriorityDashboard(userId);
    }

    @SchemaMapping(typeName = "Query", field = "getToTalTestPlanDashboard")
    public ToTalTestPlanDashboardDTO getToTalTestPlanDashboard(@Argument String userId) {
        return statisticalService.getTotalTestPlanDashboard(userId);
    }

    @SchemaMapping(typeName = "Query", field = "getAllTestCaseDetail")
    public List<TestCaseDTO> getAllTestCaseDetail(@Argument List<Long> testCaseIds) {
        return statisticalService.getAllTestCaseDetail(testCaseIds);
    }

    @SchemaMapping(typeName = "Query", field = "getAllResultInTestCase")
    public List<ResponseResultDTO> getAllResultInTestCase(@Argument List<Long> testCaseIds) {
        return statisticalService.getAllResultInTestCase(testCaseIds);
    }

    @SchemaMapping(typeName = "Query", field = "getAllCommentInTestCase")
    public List<ResponseCommentDTO> getAllCommentInTestCase(@Argument List<Long> testCaseIds) {
        return statisticalService.getAllCommentInTestCase(testCaseIds);
    }

    @SchemaMapping(typeName = "Query", field = "generateCSVIssues")
    public AttachFile generateCSVIssues(@Argument Long testPlanId, @Argument String uploadKey, @Argument String name, @Argument Integer chunk, @Argument Integer chunks) {
        return statisticalService.generateCSVIssues(testPlanId, uploadKey, name, chunk, chunks);
    }
}
