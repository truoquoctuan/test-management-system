package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.TestCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    @Query(nativeQuery = true, value = "select * from test_case where test_case_id = ?1")
    TestCase findTestCaseById(Long testCaseId);

    @Query(nativeQuery = true, value = "select distinct tc.test_case_id, tc.created_at, tc.updated_at, tc.created_by, " +
            "tc.priority, tc.description, tc.expect_result, tc.status, tc.test_case_name, tc.folder_id, tc.file_seqs " +
            "from `test_case` tc " +
            "left join label_entity le on le.entity_id = tc.test_case_id " +
            "where (:name is NULL or tc.test_case_name LIKE concat('%', :name, '%')) " +
            "and (:#{#createdBys == null || #createdBys.isEmpty()} = true or tc.created_by in (:createdBys)) " +
            "and (:#{#labelIds == null || #labelIds.isEmpty()} = true or le.label_id in (:labelIds)) " +
            "and tc.folder_id = :folderId")
    Page<TestCase> getAllByFolderId(@Param("folderId") Long folderId, @Param("name") String name, @Param("createdBys") List<String> createdBys, @Param("labelIds") List<Long> labelIds, Pageable pageable);

    @Query(nativeQuery = true, value = "select tc.test_case_id, tc.created_at, tc.updated_at, tc.created_by, tc.priority, " +
            "tc.description, tc.expect_result, tc.status, tc.test_case_name, tc.folder_id, tc.file_seqs " +
            "from test_case tc " +
            "inner join folder f on tc.folder_id = f.folder_id " +
            "where (tc.folder_id in ?1) " +
            "and (?2 IS NULL OR CAST(tc.test_case_id AS CHAR) LIKE CONCAT('%', ?2, '%')) " +
            "and (?3 IS NULL OR tc.test_case_name LIKE CONCAT('%', ?3, '%')) " +
            "and (f.test_plan_id = ?4) " +
            "order by tc.test_case_id desc")
    Page<TestCase> getAllTestCaseByTestPlanIdWithSearch(List<Long> folderIds, Long testCaseId, String testCaseName, Long testPlanId, Pageable pageable);

    @Query(nativeQuery = true, value = "select count(distinct tc.test_case_id) from test_case tc " +
            "where tc.folder_id = :folderId")
    Long countTestCaseByFolderId(Long folderId);

    @Query(nativeQuery = true, value = "delete from comment where comment_entity_id = ?1 and comment_type = ?2")
    void removeCommentsByTestCaseIdAndType(Long entityId, Integer type);
}
