package com.tms_run.repository;

import com.tms_run.entity.Folder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository  extends JpaRepository<Folder, Long> {

    @Query(nativeQuery = true, value = "select f.folder_id, f.folder_name, f.description, f.created_at, f.updated_at, " +
            "f.created_by, f.sort_order, f.upper_id, f.test_plan_id, f.status " +
            "from folder f " +
            "where f.test_plan_id = :testPlanId " +
            "and f.upper_id = 0 " +
            "and f.status = 2 " +
            "and (:searchString is null or f.folder_name LIKE %:searchString%)")
    Page<Folder> getAllFoldersRunningByTesPlanId(Long testPlanId, @Param("searchString") String searchString, Pageable pageable);

    @Query(nativeQuery = true, value = "with recursive parentInfo as (select f.folder_id, f.folder_name, f.description, f.created_at, f.updated_at, f.created_by, f.sort_order, f.upper_id, f.test_plan_id, f.status " +
            "from folder f where f.folder_id in (:upperIds)), " +
            "childInfo as (select f1.folder_id, f1.folder_name, f1.description, f1.created_at, f1.updated_at, f1.created_by, f1.sort_order, f1.upper_id, f1.test_plan_id, f1.status " +
            "from folder f1, parentInfo p " +
            "where f1.upper_id = p.folder_id " +
            "union all " +
            "select f2.folder_id, f2.folder_name, f2.description, f2.created_at, f2.updated_at, f2.created_by, f2.sort_order, f2.upper_id, f2.test_plan_id, f2.status " +
            "from folder f2 " +
            "join childInfo ci on f2.upper_id = ci.folder_id) " +
            "select * from childInfo order by created_at desc")
    List<Folder> getAllChildFoldersByUpperId(List<Integer> upperIds);

    @Query("select f.testPlan.testPlanId from Folder f where f.folderId = :folderId")
    Long getTestPlanIdByFolderId(Long folderId);
}
