package com.tms_statistic.repository;

import com.tms_statistic.entity.TestPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestPlanRepository extends JpaRepository<TestPlan, Long> {
    @Query(nativeQuery = true, value =
            "SELECT count(distinct t.test_plan_id) from test_plan t " +
            "inner join member m on m.test_plan_id = t.test_plan_id " +
            "where m.user_id = :userId or t.created_by = :userId")
    Long countTestPlan(String userId);

    @Query(nativeQuery = true, value = "SELECT count(distinct t.test_plan_id) from test_plan t " +
            "inner join member m on m.test_plan_id = t.test_plan_id " +
            "where t.status = :status and (m.user_id = :userId or t.created_by = :userId)")
    Long countTestPlanStatus(String userId, Integer status);

    @Query(nativeQuery = true, value = "SELECT DISTINCT t.test_plan_id FROM test_plan t " +
            "INNER JOIN member m ON m.test_plan_id = t.test_plan_id " +
            "WHERE m.user_id = :userId OR t.created_by = :userId")
    List<Long> getAllTestPlanIdByUserId(String userId);
}
