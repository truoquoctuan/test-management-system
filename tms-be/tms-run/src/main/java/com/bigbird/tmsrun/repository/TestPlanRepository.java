package com.tms_run.repository;

import com.tms_run.entity.TestPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TestPlanRepository extends JpaRepository<TestPlan, Long> {
    @Query("select t from TestPlan t where t.testPlanId = ?1")
    TestPlan getTestPlanByTestPlanId(Long testPlanId);

    @Query(nativeQuery = true, value = "SELECT m.role_test_plan FROM member m " +
            "WHERE m.user_id = :userId AND m.test_plan_id = :testPlanId limit 1")
    Integer getRoleInTestPlan(String userId, Long testPlanId);
}
