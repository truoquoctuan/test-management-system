package com.tms_statistic.repository;

import com.tms_statistic.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {

    @Query(nativeQuery = true, value = "SELECT count(distinct f.folder_id) from folder f " +
            "where f.test_plan_id = :testPlanId")
    Long countFolderByTestPlanId(Long testPlanId);

    @Query(nativeQuery = true, value = "SELECT count(distinct f.folder_id) from folder f " +
            "inner join member m on m.test_plan_id = f.test_plan_id " +
            "where m.user_id = :userId")
    Long countFolder(String userId);

    @Query(nativeQuery = true, value = "SELECT count(distinct f.folder_id) from folder f " +
            "inner join member m on m.test_plan_id = f.test_plan_id " +
            "where m.user_id = :userId and f.status = :status")
    Long countFolderStatus(String userId, Integer status);

    @Query(nativeQuery = true, value = "SELECT DISTINCT f.folder_id " +
            "FROM folder f " +
            "INNER JOIN test_case tc ON tc.folder_id = f.folder_id " +
            "INNER JOIN test_result ts ON ts.test_case_id = tc.test_case_id " +
            "WHERE f.test_plan_id = :testPlanId")
    List<Long> getAllFolderIdHasTestCaseResultByTestPlanId(Long testPlanId);

    @Query(nativeQuery = true, value = "select f.folder_id, f.folder_name, f.description, f.created_at, f.updated_at, " +
            "f.created_by, f.sort_order, f.upper_id, f.test_plan_id, f.status " +
            "from folder f " +
            "where f.folder_id = :id")
    Optional<Folder> getFolderById(Long id);

}
