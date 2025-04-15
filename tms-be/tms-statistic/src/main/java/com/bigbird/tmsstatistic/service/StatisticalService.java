package com.tms_statistic.service;

import com.tms_statistic.dto.*;
import com.tms_statistic.entity.AttachFile;
import org.springframework.graphql.data.method.annotation.Argument;

import java.util.List;

public interface StatisticalService {
    TotalElementDTO getTotalElementByTestPlanId(Long testPlanId);

    List<TestCaseStatusDTO> getTestCaseStatusByTestPlanId(Long testPlanId);

    List<TestCasePriorityDTO> getTestCasePriorityByTestPlanId(Long testPlanId);

    TestCasePage getAllTestCaseByFolderId(Long folderId, String name, List<Integer> status, String sorted, Integer page, Integer size);

    List<FolderDTO> getAllFolderHasTestCaseResultByTestPlanId(Long testPlanId);

    AttachFile generateCSV(Long testPlanId, String uploadKey, String name, Integer chunk, Integer chunks);

    TotalFolderDashboardDTO getTotalFolderDashboard(String userId);

    TotalTestCaseDashboardDTO getTotalTestCaseDashboard(String userId);

    List<TestCaseStatusDTO> getTestCaseStatusDashboard(String userId);

    List<TestCasePriorityDTO> getTestCasePriorityDashboard(String userId);

    ToTalTestPlanDashboardDTO getTotalTestPlanDashboard(String userId);

    List<TestCaseDTO> getAllTestCaseDetail(List<Long> testCaseIds);

    List<ResponseResultDTO> getAllResultInTestCase(List<Long> testCaseIds);

    List<ResponseCommentDTO> getAllCommentInTestCase(List<Long> testCaseIds);

    TestCasePage getTestCaseInTestPlan(Long testPlanId, Integer page, Integer size);

    AttachFile generateCSVIssues(Long testPlanId, String uploadKey, String name, Integer chunk, Integer chunks);

}
