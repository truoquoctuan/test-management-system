package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.Folder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {

    @Query(nativeQuery = true, value = "select f.folder_id, f.folder_name, f.description, f.created_at, f.updated_at, f.created_by, f.sort_order, f.upper_id, f.test_plan_id, f.status " +
            "from folder f " +
            "where f.folder_id = :id")
    Optional<Folder> getFolderById(Long id);

    @Query(nativeQuery = true, value = "select f.folder_id, f.folder_name, f.description, f.created_at, f.updated_at, f.created_by, f.sort_order, f.upper_id, f.test_plan_id, f.status " +
            "from folder f " +
            "where f.test_plan_id = :testPlanId " + "and f.upper_id = 0 " +
            "and (:searchString is null or f.folder_name LIKE %:searchString%)")
    Page<Folder> getAllFoldersByTesPlanId(Long testPlanId, @Param("searchString") String searchString, Pageable pageable);

    @Query(nativeQuery = true, value = "select max(sort_order) from folder where upper_id = ?1")
    Integer getMaxSortOrderByUpperId(Long upperId);

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
    List<Folder> getAllChildFoldersByUpperId(List<Long> upperIds);

    @Query(nativeQuery = true, value = "select * from folder where folder_id = ?1")
    Folder getFolderByFolderId(Long folderId);

    @Query(nativeQuery = true, value = "SELECT distinct t.created_by FROM `test_case` t WHERE t.folder_id = ?1;")
    Page<String> getMemberCreatedTestCaseInFolder(@Param("folderId") Long folderId, Pageable pageable);

    @Query(nativeQuery = true, value = "SELECT case when EXISTS( " +
            "SELECT distinct t.created_by FROM `test_case` t WHERE t.folder_id = :folderId AND t.created_by = :creatorId" +
            ") then 1 ELSE 0 END")
    Integer isExistsCreatorInFolder(Long folderId, String creatorId);

    @Modifying
    @Transactional
    @Query("delete from Folder f where f.upperId = :upperId")
    void deleteFolderByUpperId(Long upperId);

    @Query("select f.folderId from Folder f where f.upperId = :upperId")
    List<Long> getFolderIdByUpperId(Long upperId);

    @Query(nativeQuery = true, value = "select f1.folder_id from folder f1 " +
            "left join folder f2 on f1.upper_id = f2.folder_id " +
            "left join folder f3 on f2.upper_id = f3.folder_id " +
            "where f1.test_plan_id = ?1 " +
            "and (" +
            "(f1.upper_id = 0 and f1.status = 2) " +
            "or (f1.upper_id != 0 and f1.status = 1 and f2.status = 2) " +
            "or (f1.upper_id != 0 and f1.status = 1 and f2.status = 1 and f3.status = 2) " +
            ")")
    List<Long> getAllFolderIdRunningIncludingChildrenInTestPlanId(Long testPlanId);
}
