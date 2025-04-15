package com.tms_statistic.repository;

import com.tms_statistic.dto.TestCaseDTO;
import com.tms_statistic.entity.TestCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    @Query(nativeQuery = true, value = "SELECT COUNT(DISTINCT tc.test_case_id) FROM test_case tc " +
            "INNER JOIN folder f ON f.folder_id = tc.folder_id " +
            "WHERE f.test_plan_id = :testPlanId")
    Long countTestCaseByTestPlanId(Long testPlanId);

    @Query(nativeQuery = true, value = "SELECT COUNT(DISTINCT tc.test_case_id) FROM test_case tc " +
            "INNER JOIN folder f ON f.folder_id = tc.folder_id " +
            "WHERE f.test_plan_id in :testPlanIds ")
    Long countTestCase(List<Long> testPlanIds);

    @Query(nativeQuery = true, value = "SELECT COUNT(DISTINCT tc.test_case_id) FROM test_case tc " +
            "INNER JOIN test_result ts ON ts.test_case_id = tc.test_case_id " +
            "INNER JOIN folder f ON f.folder_id = tc.folder_id " +
            "WHERE f.test_plan_id = :testPlanId")
    Long countTestCaseWithResultsByTestPlanId(Long testPlanId);

    @Query(nativeQuery = true, value = "SELECT COUNT(DISTINCT tc.test_case_id) FROM test_case tc " +
            "INNER JOIN test_result ts ON ts.test_case_id = tc.test_case_id " +
            "INNER JOIN folder f ON f.folder_id = tc.folder_id " +
            "WHERE f.test_plan_id in :testPlanIds ")
    Long countTestCaseWithResults(List<Long> testPlanIds);

    @Query(nativeQuery = true,
            value = "WITH test_case_with_result AS (" +
                    "SELECT DISTINCT tc.test_case_id " +
                    "FROM test_case tc " +
                    "INNER JOIN test_result ts ON ts.test_case_id = tc.test_case_id " +
                    "INNER JOIN folder f ON f.folder_id = tc.folder_id " +
                    "WHERE f.test_plan_id = :testPlanId" +
                    ") " +
                    "SELECT COUNT(DISTINCT tc.test_case_id) " +
                    "FROM test_case tc " +
                    "inner join folder f ON f.folder_id = tc.folder_id " +
                    "WHERE tc.test_case_id NOT IN (SELECT test_case_id FROM test_case_with_result) " +
                    "and f.test_plan_id = :testPlanId")
    Long countTestCaseWithoutResultsByTestPlanId(Long testPlanId);

    @Query(nativeQuery = true,
            value = "WITH test_case_with_result AS (" +
                    "SELECT DISTINCT tc.test_case_id " +
                    "FROM test_case tc " +
                    "INNER JOIN test_result ts ON ts.test_case_id = tc.test_case_id ) " +
                    "SELECT COUNT(DISTINCT tc.test_case_id) FROM test_case tc " +
                    "INNER JOIN folder f ON f.folder_id = tc.folder_id " +
                    "WHERE tc.test_case_id NOT IN (SELECT test_case_id FROM test_case_with_result) and f.test_plan_id in :testPlanIds")
    Long countTestCaseWithoutResults(List<Long> testPlanIds);


    @Query(nativeQuery = true,
            value = "WITH test_result_last AS ( " +
                    "    SELECT tr.test_result_id FROM test_result tr " +
                    "    INNER JOIN test_case tc ON tc.test_case_id = tr.test_case_id " +
                    "    WHERE tr.test_result_id = ( SELECT MAX(tr2.test_result_id) FROM test_result tr2 WHERE tr2.test_case_id = tc.test_case_id ) " +
                    ") " +
                    "SELECT tr.status AS status, COUNT(tc.test_case_id) AS count " +
                    "FROM test_case tc " +
                    "INNER JOIN test_result tr ON tr.test_case_id = tc.test_case_id " +
                    "INNER JOIN folder f ON tc.folder_id = f.folder_id " +
                    "WHERE f.test_plan_id = :testPlanId " +
                    "and tr.test_result_id in (SELECT test_result_id FROM test_result_last) " +
                    "GROUP BY tr.status")
    List<Object[]> getTestCaseStatus(Long testPlanId);

    @Query(nativeQuery = true,
            value = "WITH test_result_last AS ( " +
                    "    SELECT tr.test_result_id FROM test_result tr " +
                    "    INNER JOIN test_case tc ON tc.test_case_id = tr.test_case_id " +
                    "    WHERE tr.test_result_id = ( SELECT MAX(tr2.test_result_id) FROM test_result tr2 WHERE tr2.test_case_id = tc.test_case_id ) " +
                    ") " +
                    "SELECT tr.status AS status, COUNT(tc.test_case_id) AS count " +
                    "FROM test_case tc " +
                    "INNER JOIN test_result tr ON tr.test_case_id = tc.test_case_id " +
                    "INNER JOIN folder f ON tc.folder_id = f.folder_id " +
                    "WHERE f.test_plan_id in :testPlanIds " +
                    "and tr.test_result_id in (SELECT test_result_id FROM test_result_last) " +
                    "GROUP BY tr.status")
    List<Object[]> getTestCaseStatusDashBoard(List<Long> testPlanIds);

    @Query(nativeQuery = true,
            value = "SELECT tc.priority, COUNT(tc.test_case_id) FROM test_case tc " +
                    "INNER JOIN folder f ON f.folder_id = tc.folder_id " +
                    "WHERE f.test_plan_id = :testPlanId " +
                    "GROUP BY tc.priority ")
    List<Object[]> getTestCasePriority(Long testPlanId);

    @Query(nativeQuery = true,
            value = "SELECT tc.priority, COUNT(tc.test_case_id) FROM test_case tc " +
                    "inner join folder f on f.folder_id = tc.folder_id " +
                    "where f.test_plan_id in :testPlanIds " +
                    "GROUP BY tc.priority ")
    List<Object[]> getTestCasePriorityDashBoard(List<Long> testPlanIds);

    @Query("SELECT new com.tms_statistic.dto.TestCaseDTO(tc.testCaseId,tc.testCaseName, tc.priority, tc.status, tc.createdBy, tc.folder.folderId, tr.status, tc.createdAt, tc.updatedAt) " +
            "FROM TestCase tc " +
            "INNER JOIN TestResult tr ON tr.testCase.testCaseId = tc.testCaseId AND tr.testResultId = " +
            "(SELECT MAX(tr2.testResultId) FROM TestResult tr2 WHERE tr2.testCase.testCaseId = tc.testCaseId) " +
            "WHERE tc.folder.folderId = :folderId " +
            "and (:name is null or tc.testCaseName like %:name%) " +
            "AND (:statuses IS NULL OR tr.status IN :statuses)")
    Page<TestCaseDTO> getAllTestCaseByFolderId(Long folderId, String name, List<Integer> statuses, Pageable pageable);

    @Query("SELECT new com.tms_statistic.dto.TestCaseDTO(tc.testCaseId,tc.testCaseName, tc.priority, tc.status, tc.createdBy, tc.folder.folderId, tc.description, tc.expectResult, tr.status, tc.createdAt, tc.updatedAt) " +
            "FROM TestCase tc " +
            "LEFT JOIN TestResult tr ON tr.testCase.testCaseId = tc.testCaseId AND tr.testResultId = " +
            "(SELECT MAX(tr2.testResultId) FROM TestResult tr2 WHERE tr2.testCase.testCaseId = tc.testCaseId) " +
            "WHERE tc.folder.folderId = :folderId ")
    List<TestCaseDTO> getAllTestCaseResultByFolderId(Long folderId);

    @Query("SELECT new com.tms_statistic.dto.TestCaseDTO(tc.testCaseId,tc.testCaseName, tc.priority, tc.status, tc.createdBy, tc.folder.folderId, tc.description, tc.expectResult, tr.status, tc.createdAt, tc.updatedAt) " +
            "FROM TestCase tc " +
            "LEFT JOIN TestResult tr ON tr.testCase.testCaseId = tc.testCaseId AND tr.testResultId = " +
            "(SELECT MAX(tr2.testResultId) FROM TestResult tr2 WHERE tr2.testCase.testCaseId = tc.testCaseId) " +
            "WHERE tc.testCaseId = :testCaseId ")
    TestCaseDTO getTestCaseDetail(Long testCaseId);

    @Query(nativeQuery = true, value = "select tc.test_case_id from test_case tc " +
            "inner join folder f on f.folder_id = tc.folder_id " +
            "where f.test_plan_id = :testPlanId")
    Page<Long> getTestCaseIdByTestPlanId(Long testPlanId, Pageable pageable);
}
