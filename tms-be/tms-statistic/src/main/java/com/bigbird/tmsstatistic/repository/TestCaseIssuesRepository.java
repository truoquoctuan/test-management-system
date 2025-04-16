package com.tms_statistic.repository;

import com.tms_statistic.entity.TestCaseIssues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseIssuesRepository extends JpaRepository<TestCaseIssues, Long> {
    @Query("select distinct t.testCaseId from TestCaseIssues t where t.issuesId = :issuesId")
    List<Long> getTestCaseIdByIssuesId(Long issuesId);
}
