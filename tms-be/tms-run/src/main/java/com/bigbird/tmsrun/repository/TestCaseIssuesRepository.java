package com.tms_run.repository;

import com.tms_run.entity.TestCaseIssues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseIssuesRepository extends JpaRepository<TestCaseIssues, Long> {
    @Query("select distinct t.testCase.testCaseId from TestCaseIssues t where t.issues.issuesId = :issuesId")
    List<Long> getTestCaseIdByIssuesId(Long issuesId);
    @Modifying
    @Query("delete from TestCaseIssues t where t.testCase.testCaseId = :testCaseId and t.issues.issuesId = :issuesId")
    void removeTestCaseIssuesByTestCaseIdAndIssuesId(Long testCaseId, Long issuesId);
    @Modifying
    @Query("delete from TestCaseIssues t where t.issues.issuesId = :issuesId")
    void removeTestCaseIssuesByIssuesId(Long issuesId);


}
