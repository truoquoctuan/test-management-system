package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.TestPlan;
import com.bigbird.tmsrepo.dto.TestPlanDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestPlanRepository extends JpaRepository<TestPlan, Long> {

    @Query("SELECT DISTINCT new com.bigbird.tmsrepo.dto.TestPlanDTO(t.testPlanId, t.testPlanName, t.description, t.status, t.startDate, t.endDate, t.createdBy, CASE WHEN p.pinId IS NOT NULL THEN TRUE ELSE FALSE END, t.createdAt, t.updatedAt) " +
            "FROM TestPlan t " +
            "inner JOIN Member m ON m.testPlan.testPlanId = t.testPlanId AND m.userId = :userId " +
            "left join Pin p on p.testPlan.testPlanId = t.testPlanId and p.userId = :userId " +
            "WHERE (:name IS NULL OR t.testPlanName LIKE %:name%) " +
            "AND (:createdBys IS NULL OR t.createdBy IN (:createdBys)) " +
            "AND (:status IS NULL OR t.status = :status) " +
            "ORDER BY CASE WHEN p.pinId > 0 THEN 0 ELSE 1 END, " +
            "case when p.pinId > 0 then p.pinnedAt else 1 end")
    Page<TestPlanDTO> getAllTestPlan(@Param("userId") String userId, @Param("name") String name, @Param("createdBys") List<String> createdBys, @Param("status") Integer status, Pageable pageable);

    @Query("SELECT DISTINCT new com.bigbird.tmsrepo.dto.TestPlanDTO(t.testPlanId, t.testPlanName, t.description, t.status, t.startDate, t.endDate, t.createdBy, CASE WHEN p.pinId IS NOT NULL THEN TRUE ELSE FALSE END, t.createdAt, t.updatedAt) " +
            "FROM TestPlan t " +
            "left join Pin p on p.testPlan.testPlanId = t.testPlanId and p.userId = :userId " +
            "WHERE (:name IS NULL OR t.testPlanName LIKE %:name%) " +
            "AND (:createdBys IS NULL OR t.createdBy IN (:createdBys)) " +
            "AND (:status IS NULL OR t.status = :status) " +
            "ORDER BY CASE WHEN p.pinId > 0 THEN 0 ELSE 1 END, " +
            "case when p.pinId > 0 then p.pinnedAt else 1 end")
    Page<TestPlanDTO> getAllTestPlanForAdmin(String userId, @Param("name") String name, @Param("createdBys") List<String> createdBys, @Param("status") Integer status, Pageable pageable);

    @Query(nativeQuery = true, value = "SELECT t.test_plan_id, t.test_plan_name, t.start_date, t.end_date, t.created_at, t.updated_at, t.created_by, t.description, t.status " +
            "FROM `test_plan` t where t.test_plan_id = :testPlanId")
    TestPlan getTestPlanById(@Param("testPlanId") Long testPlanId);

    @Query(nativeQuery = true, value = "update test_plan set status = ?2 where test_plan_id = ?1")
    void disableTestPlan(Long testPlanId, Integer status);

    @Query(nativeQuery = true, value = "SELECT DISTINCT tl.created_by FROM test_plan tl " +
            "INNER JOIN member m ON m.test_plan_id = tl.test_plan_id " +
            "WHERE m.user_id = :userId or tl.created_by = :userId")
    Page<String> getCreator(String userId, Pageable pageable);

    @Query(nativeQuery = true, value = "SELECT DISTINCT tl.created_by FROM test_plan tl")
    Page<String> getCreatorForAdmin(Pageable pageable);

    @Query(nativeQuery = true, value = "SELECT case when EXISTS( " +
            "SELECT * FROM member m " +
            "INNER JOIN test_plan tl ON m.test_plan_id = tl.test_plan_id " +
            "WHERE m.user_id = :userId AND tl.created_by = :creatorId" +
            ") then 1 ELSE 0 END ")
    Integer isExistsCreatorCreatedTestPlanHasUser(String userId, String creatorId);

    @Query(nativeQuery = true, value = "SELECT case when EXISTS( " +
            "SELECT * FROM test_plan tl " +
            "WHERE tl.created_by = :creatorId" +
            ") then 1 ELSE 0 END ")
    Integer isExistsCreatorCreatedTestPlanHasUser(String creatorId);

    @Query(nativeQuery = true, value = "select * from test_plan where test_plan_id = ?1")
    TestPlan getTestPlansByTestPlanId(Long testPlanId);

    @Query(nativeQuery = true, value = "select count(*) from test_case where folder_id = ?1")
    int checkFolderHasTestCase(Long folderId);

    @Query(nativeQuery = true, value = "SELECT m.role_test_plan FROM member m " +
            "WHERE m.user_id = :userId AND m.test_plan_id = :testPlanId limit 1")
    Integer getRoleInTestPlan(String userId, Long testPlanId);
}
