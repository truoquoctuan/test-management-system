package com.tms_statistic.repository;

import com.tms_statistic.entity.Issues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssuesRepository extends JpaRepository<Issues, Long> {

    @Query(nativeQuery = true, value = "select distinct i.issues_id " +
            "from issues i " +
            "inner join test_plan tp on tp.test_plan_id = i.test_plan_id " +
            "where i.test_plan_id = :testPlanId")
    List<Long> getAllIssuesIdByTestPlanId(Long testPlanId);

    @Query(nativeQuery = true, value = "select * from issues where issues_id = ?1")
    Issues getIssuesById(Long issuesId);

    @Query(value = "select distinct i.issuesId from Issues i where i.testPlan.testPlanId = :testPlanId")
    List<Long> getAllIssuesId(Long testPlanId);
}
