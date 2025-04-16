package com.tms_statistic.repository;

import com.tms_statistic.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    @Query(nativeQuery = true, value = "select tr.test_result_id, tr.created_at, tr.updated_at, tr.content, tr.status, tr.user_id, tr.test_case_id, tr.file_seqs " +
            "from test_result tr where tr.test_case_id = :testCaseId")
    List<TestResult> getTestResultsByTestCaseId(Long testCaseId);

    @Query(nativeQuery = true, value = "select tr.test_result_id, tr.created_at, tr.updated_at, tr.content, tr.status, tr.user_id, tr.test_case_id, tr.file_seqs " +
            "from test_result tr where tr.test_case_id = :testCaseId " +
            "and tr.test_result_id = ( SELECT MAX(tr2.test_result_id) FROM test_result tr2 WHERE tr2.test_case_id = :testCaseId ) ")
    TestResult getLastTestResultByTestCaseId(Long testCaseId);
}
