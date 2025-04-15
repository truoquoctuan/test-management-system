package com.tms_run.repository;

import com.tms_run.entity.TestCase;
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

//    @Query(nativeQuery = true, value = " with data as (select tc.test_case_id, tc.created_at, tc.updated_at, tc.created_by, " +
//            "tc.priority, tc.description, tc.expect_result, tc.status, tc.test_case_name, tc.folder_id, tc.file_seqs, tcl.label_id, " +
//            "(select tr.status from `test_result` tr where tc.test_case_id = tr.test_case_id order by tr.test_result_id desc limit 1) as resultTestCase " +
//            "from `test_case` tc " +
//            "left join `test_case_label` tcl on tcl.test_case_id = tc.test_case_id " +
//            "where (:searchString is NULL or tc.test_case_name LIKE concat('%', :searchString, '%')) " +
//            "and (:createdBys is null or tc.created_by in (:createdBys)) " +
//            "and (:labelIds is null or tcl.label_id in (:labelIds)) " +
//            "and tc.folder_id = :folderId group by test_case_id) " +
//            "select * from data where case when :resultStatus is null then 1 = 1 else data.resultTestCase in(:resultStatus) end",
//            countQuery = " with data as (select tc.test_case_id, tc.created_at, tc.updated_at, tc.created_by, " +
//                    "tc.priority, tc.description, tc.expect_result, tc.status, tc.test_case_name, tc.folder_id, tc.file_seqs, tcl.label_id, " +
//                    "(select tr.status from `test_result` tr where tc.test_case_id = tr.test_case_id order by tr.test_result_id desc limit 1) as resultTestCase " +
//                    "from `test_case` tc " +
//                    "left join `test_case_label` tcl on tcl.test_case_id = tc.test_case_id " +
//                    "where (:searchString is NULL or tc.test_case_name LIKE concat('%', :searchString, '%')) " +
//                    "and (:createdBys is null or tc.created_by in (:createdBys)) " +
//                    "and (:labelIds is null or tcl.label_id in (:labelIds)) " +
//                    "and tc.folder_id = :folderId group by test_case_id) " +
//                    "select COUNT(*) from data where case when :resultStatus is null then 1 = 1 else data.resultTestCase in(:resultStatus) end")
//    Page<TestCase> getAllByFolderId(Long folderId, String searchString,
//                                    List<Long> createdBys, List<Long> labelIds,
//                                    List<Long> resultStatus, Pageable pageable);

//    @Query(nativeQuery = true, value = "select distinct tc.test_case_id, tc.created_at, tc.updated_at, tc.created_by, tc.priority, tc.description, tc.expect_result, tc.status, tc.test_case_name, tc.folder_id, tc.file_seqs " +
//            "from `test_case` tc " +
//            "left join `test_case_label` tcl on tcl.test_case_id = tc.test_case_id " +
//            "left join `test_result` tr on tr.test_case_id = tc.test_case_id " +
//            "AND tr.test_result_id = (SELECT MAX(tr2.test_result_id) FROM `test_result` tr2 WHERE tr2.test_case_id = tc.test_case_id) " +
//            "where (:name is NULL or tc.test_case_name LIKE concat('%', :name, '%')) " +
//            "and (:#{#createdBys == null || #createdBys.isEmpty()} = true or tc.created_by in (:createdBys)) " +
//            "and (:#{#labelIds == null || #labelIds.isEmpty()} = true or tcl.label_id in (:labelIds)) " +
//            "AND (:#{#resultStatus == null || #resultStatus.isEmpty()} = true " +
//            "OR (tr.status IN (:resultStatus)) " +
//            "OR (:#{#resultStatus != null && #resultStatus.contains(5)} = true AND tr.status IS NULL)) " +
//            "and tc.folder_id = :folderId")
//    Page<TestCase> getAllByFolderId(@Param("folderId") Long folderId, @Param("name") String name, @Param("createdBys") List<Long> createdBys, @Param("labelIds") List<Long> labelIds, @Param("resultStatus") List<Integer> resultStatus, Pageable pageable);

    @Query(nativeQuery = true, value =
            "WITH temp(entity_id, label_id) " +
                    "AS ( " +
                    "   SELECT DISTINCT le.entity_id, le.label_id FROM label_entity le " +
                    "   INNER JOIN label l ON l.label_id = le.label_id " +
                    "   WHERE l.label_type = 1 " +
                    ") " +
                    "SELECT DISTINCT tc.test_case_id, tc.created_at, tc.updated_at, tc.created_by, tc.priority, tc.description, " +
                    "tc.expect_result, tc.status, tc.test_case_name, tc.folder_id, tc.file_seqs " +
                    "FROM test_case tc " +
                    "LEFT JOIN temp tp ON tp.entity_id = tc.test_case_id " +
                    "WHERE (:name IS NULL OR tc.test_case_name LIKE CONCAT('%', :name, '%')) " +
                    "AND (:#{#createdBys == null || #createdBys.isEmpty()} = true OR tc.created_by IN (:createdBys)) " +
                    "AND (:#{#labelIds == null || #labelIds.isEmpty()} = true OR tp.label_id IN (:labelIds)) " +
                    "AND (:#{#resultStatus == null || #resultStatus.isEmpty()} = true OR tc.status IN (:resultStatus)) " +
                    "AND tc.folder_id = :folderId",
            countQuery = "WITH temp(entity_id, label_id) " +
                    "AS ( " +
                    "   SELECT DISTINCT le.entity_id, le.label_id FROM label_entity le " +
                    "   INNER JOIN label l ON l.label_id = le.label_id " +
                    "   WHERE l.label_type = 1 " +
                    ") " +
                    "SELECT DISTINCT tc.test_case_id " +
                    "FROM test_case tc " +
                    "LEFT JOIN temp tp ON tp.entity_id = tc.test_case_id " +
                    "WHERE (:name IS NULL OR tc.test_case_name LIKE CONCAT('%', :name, '%')) " +
                    "AND (:#{#createdBys == null || #createdBys.isEmpty()} = true OR tc.created_by IN (:createdBys)) " +
                    "AND (:#{#labelIds == null || #labelIds.isEmpty()} = true OR tp.label_id IN (:labelIds)) " +
                    "AND (:#{#resultStatus == null || #resultStatus.isEmpty()} = true OR tc.status IN (:resultStatus)) " +
                    "AND tc.folder_id = :folderId")
    Page<TestCase> getAllByFolderId(@Param("folderId") Long folderId, @Param("name") String name, @Param("createdBys") List<String> createdBys, @Param("labelIds") List<Long> labelIds, @Param("resultStatus") List<Integer> resultStatus, Pageable pageable);

    @Query(nativeQuery = true, value = "select tr.status from test_result tr where tr.test_case_id = :testCaseId order by tr.test_result_id desc limit 1")
    Integer getNewestResultStatusByTestCaseId(Long testCaseId);

    @Query("select tc.folder.testPlan.testPlanId from TestCase tc where tc.testCaseId = :testCaseId")
    Long getTestPlanIdByTestCaseId(Long testCaseId);
}
