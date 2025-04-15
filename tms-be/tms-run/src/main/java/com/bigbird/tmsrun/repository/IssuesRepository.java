package com.tms_run.repository;

import com.tms_run.entity.Issues;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssuesRepository extends JpaRepository<Issues, Long> {

    @Query("select i.testPlan.testPlanId from Issues i where i.issuesId = :IssuesId")
    Long getTestPlanIdByIssuesId(Long IssuesId);

    @Query(value = "select i from Issues i where i.issuesId = ?1")
    Issues findIssuesByIssuesId(Long issuesId);

    @Query(nativeQuery = true, value = "update issues set status = ?1 where issues_id = ?2")
    void updateIssuesStatus(int status, Long issueId);

    @Query(nativeQuery = true, value = "delete from issues where issues_id IN ?1")
    void removeIssuesByIssuesIds(List<Long> issuesIds);

    @Query(
            nativeQuery = true,
            value = "WITH " +
                    "assign_filter(entity_id) AS(" +
                    "   SELECT a.entity_id " +
                    "   FROM assign a " +
                    "   WHERE a.assign_type = 2 " +
                    "   GROUP BY a.entity_id " +
                    "   HAVING (" +
                    "       COUNT(DISTINCT a.user_id) = :#{#assignIds != null ? #assignIds.size() : 0} " +
                    "       AND " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN a.user_id IN (:assignIds) THEN a.user_id " +
                    "       END) = :#{#assignIds != null ? #assignIds.size() : 0}" +
                    "   ) " +
                    "   OR " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN a.user_id IN (:assignIds) THEN a.user_id " +
                    "       END) = :#{#assignIds != null ? #assignIds.size() : 0} " +
                    "), " +
                    "test_case_filter(issues_id) AS(" +
                    "   SELECT tcs.issues_id " +
                    "   FROM test_case_issues tcs " +
                    "   JOIN test_case tc ON tcs.test_case_id = tc.test_case_id " +
                    "   GROUP BY tcs.issues_id " +
                    "   HAVING (" +
                    "       COUNT(DISTINCT tc.test_case_id) = :#{#testCaseIds != null ? #testCaseIds.size() : 0} " +
                    "       AND " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN tc.test_case_id IN (:testCaseIds) THEN tc.test_case_id " +
                    "       END) = :#{#testCaseIds != null ? #testCaseIds.size() : 0}" +
                    "   )" +
                    "   OR " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN tc.test_case_id IN (:testCaseIds) THEN tc.test_case_id " +
                    "       END) = :#{#testCaseIds != null ? #testCaseIds.size() : 0} " +
                    "), " +
                    "label_filter(entity_id) AS(" +
                    "   SELECT le.entity_id " +
                    "   FROM label_entity le " +
                    "   JOIN label l ON le.label_id = l.label_id " +
                    "   WHERE l.label_type = 2 " +
                    "   GROUP BY le.entity_id " +
                    "   HAVING (" +
                    "       COUNT(DISTINCT l.label_id) = :#{#tags != null ? #tags.size() : 0} " +
                    "       AND " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN l.label_id IN (:tags) THEN l.label_id " +
                    "       END) = :#{#tags != null ? #tags.size() : 0}" +
                    "   )" +
                    "   OR " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN l.label_id IN (:tags) THEN l.label_id " +
                    "       END) = :#{#tags != null ? #tags.size() : 0} " +
                    ")" +
                    "SELECT DISTINCT " +
                    "i.issues_id, i.test_plan_id, i.created_by, i.issues_name, i.priority, i.`status`, i.created_at, " +
                    "i.updated_at, i.scope, i.start_date, i.end_date, i.description, i.note " +
                    "FROM " +
                    "issues i " +
                    "LEFT JOIN assign_filter af ON i.issues_id = af.entity_id " +
                    "LEFT JOIN test_case_filter tcf ON i.issues_id = tcf.issues_id " +
                    "LEFT JOIN label_filter lf ON i.issues_id = lf.entity_id " +
                    "WHERE " +
                    "i.test_plan_id = :testPlanId " +
                    "AND (:#{#assignIds == null || #assignIds.isEmpty()} = true " +
                    "     OR (:exactFilterMatch = true AND :#{#assignIds != null} AND af.entity_id IS NOT NULL)" +
                    "     OR (:exactFilterMatch = false AND EXISTS( " +
                    "         SELECT 1 FROM assign a " +
                    "         WHERE a.entity_id = i.issues_id " +
                    "         AND a.assign_type = 2 AND a.user_id IN (:assignIds) " +
                    "         )" +
                    "     )" +
                    ") " +
                    "AND (:#{#testCaseIds == null || #testCaseIds.isEmpty()} = true " +
                    "     OR (:exactFilterMatch = true AND :#{#testCaseIds != null} AND tcf.issues_id IS NOT NULL)" +
                    "     OR (:exactFilterMatch = false AND EXISTS(" +
                    "         SELECT 1 FROM test_case_issues tcs " +
                    "         JOIN test_case tc " +
                    "         ON tcs.test_case_id = tc.test_case_id " +
                    "         WHERE tcs.issues_id = i.issues_id " +
                    "         AND tc.test_case_id IN (:testCaseIds)" +
                    "         )" +
                    "     )" +
                    ") " +
                    "AND (:#{#tags == null || #tags.isEmpty()} = true " +
                    "     OR (:exactFilterMatch = true AND :#{#tags != null} AND lf.entity_id IS NOT NULL)" +
                    "     OR (:exactFilterMatch = false AND EXISTS(" +
                    "         SELECT 1 FROM label_entity le " +
                    "         JOIN label l " +
                    "         ON le.label_id = l.label_id " +
                    "         WHERE le.entity_id = i.issues_id " +
                    "         AND l.label_type = 2 AND l.label_id IN (:tags)" +
                    "         )" +
                    "     )" +
                    ") " +
                    "AND (" +
                    "   :#{#issuesIds == null || #issuesIds.isEmpty()} = true " +
                    "   OR " +
                    "   i.issues_id IN (:issuesIds)" +
                    ") " +
                    "AND (" +
                    "   :issuesName IS NULL " +
                    "   OR " +
                    "   i.issues_name LIKE CONCAT('%', :issuesName, '%')" +
                    ") " +
                    "AND (" +
                    "   :#{#priorities == null || #priorities.isEmpty()} = true " +
                    "   OR " +
                    "   i.priority IN (:priorities)" +
                    ") " +
                    "AND (" +
                    "   :#{#status == null || #status.isEmpty()} = true " +
                    "   OR " +
                    "   i.status IN (:status)" +
                    ") " +
                    "AND (" +
                    "   CAST(:startDate AS DATE) IS NULL " +
                    "   OR " +
                    "   i.start_date >= :startDate" +
                    ") " +
                    "AND (" +
                    "   CAST(:endDate AS DATE) IS NULL " +
                    "   OR " +
                    "   i.end_date <= :endDate" +
                    ") ",
            countQuery = "WITH " +
                    "assign_filter(entity_id) AS(" +
                    "   SELECT a.entity_id " +
                    "   FROM assign a " +
                    "   WHERE a.assign_type = 2 " +
                    "   GROUP BY a.entity_id " +
                    "   HAVING (" +
                    "       COUNT(DISTINCT a.user_id) = :#{#assignIds != null ? #assignIds.size() : 0} " +
                    "       AND " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN a.user_id IN (:assignIds) THEN a.user_id " +
                    "       END) = :#{#assignIds != null ? #assignIds.size() : 0}" +
                    "   ) " +
                    "   OR " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN a.user_id IN (:assignIds) THEN a.user_id " +
                    "       END) = :#{#assignIds != null ? #assignIds.size() : 0} " +
                    "), " +
                    "test_case_filter(issues_id) AS(" +
                    "   SELECT tcs.issues_id " +
                    "   FROM test_case_issues tcs " +
                    "   JOIN test_case tc ON tcs.test_case_id = tc.test_case_id " +
                    "   GROUP BY tcs.issues_id " +
                    "   HAVING (" +
                    "       COUNT(DISTINCT tc.test_case_id) = :#{#testCaseIds != null ? #testCaseIds.size() : 0} " +
                    "       AND " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN tc.test_case_id IN (:testCaseIds) THEN tc.test_case_id " +
                    "       END) = :#{#testCaseIds != null ? #testCaseIds.size() : 0}" +
                    "   )" +
                    "   OR " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN tc.test_case_id IN (:testCaseIds) THEN tc.test_case_id " +
                    "       END) = :#{#testCaseIds != null ? #testCaseIds.size() : 0} " +
                    "), " +
                    "label_filter(entity_id) AS(" +
                    "   SELECT le.entity_id " +
                    "   FROM label_entity le " +
                    "   JOIN label l ON le.label_id = l.label_id " +
                    "   WHERE l.label_type = 2 " +
                    "   GROUP BY le.entity_id " +
                    "   HAVING (" +
                    "       COUNT(DISTINCT l.label_id) = :#{#tags != null ? #tags.size() : 0} " +
                    "       AND " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN l.label_id IN (:tags) THEN l.label_id " +
                    "       END) = :#{#tags != null ? #tags.size() : 0}" +
                    "   )" +
                    "   OR " +
                    "       COUNT(DISTINCT CASE " +
                    "       WHEN l.label_id IN (:tags) THEN l.label_id " +
                    "       END) = :#{#tags != null ? #tags.size() : 0} " +
                    ")" +
                    "SELECT DISTINCT COUNT(i.issues_id) " +
                    "FROM " +
                    "issues i " +
                    "LEFT JOIN assign_filter af ON i.issues_id = af.entity_id " +
                    "LEFT JOIN test_case_filter tcf ON i.issues_id = tcf.issues_id " +
                    "LEFT JOIN label_filter lf ON i.issues_id = lf.entity_id " +
                    "WHERE " +
                    "i.test_plan_id = :testPlanId " +
                    "AND (:#{#assignIds == null || #assignIds.isEmpty()} = true " +
                    "     OR (:exactFilterMatch = true AND :#{#assignIds != null} AND af.entity_id IS NOT NULL)" +
                    "     OR (:exactFilterMatch = false AND EXISTS( " +
                    "         SELECT 1 FROM assign a " +
                    "         WHERE a.entity_id = i.issues_id " +
                    "         AND a.assign_type = 2 AND a.user_id IN (:assignIds) " +
                    "         )" +
                    "     )" +
                    ") " +
                    "AND (:#{#testCaseIds == null || #testCaseIds.isEmpty()} = true " +
                    "     OR (:exactFilterMatch = true AND :#{#testCaseIds != null} AND tcf.issues_id IS NOT NULL)" +
                    "     OR (:exactFilterMatch = false AND EXISTS(" +
                    "         SELECT 1 FROM test_case_issues tcs " +
                    "         JOIN test_case tc " +
                    "         ON tcs.test_case_id = tc.test_case_id " +
                    "         WHERE tcs.issues_id = i.issues_id " +
                    "         AND tc.test_case_id IN (:testCaseIds)" +
                    "         )" +
                    "     )" +
                    ") " +
                    "AND (:#{#tags == null || #tags.isEmpty()} = true " +
                    "     OR (:exactFilterMatch = true AND :#{#tags != null} AND lf.entity_id IS NOT NULL)" +
                    "     OR (:exactFilterMatch = false AND EXISTS(" +
                    "         SELECT 1 FROM label_entity le " +
                    "         JOIN label l " +
                    "         ON le.label_id = l.label_id " +
                    "         WHERE le.entity_id = i.issues_id " +
                    "         AND l.label_type = 2 AND l.label_id IN (:tags)" +
                    "         )" +
                    "     )" +
                    ") " +
                    "AND (" +
                    "   :#{#issuesIds == null || #issuesIds.isEmpty()} = true " +
                    "   OR " +
                    "   i.issues_id IN (:issuesIds)" +
                    ") " +
                    "AND (" +
                    "   :issuesName IS NULL " +
                    "   OR " +
                    "   i.issues_name LIKE CONCAT('%', :issuesName, '%')" +
                    ") " +
                    "AND (" +
                    "   :#{#priorities == null || #priorities.isEmpty()} = true " +
                    "   OR " +
                    "   i.priority IN (:priorities)" +
                    ") " +
                    "AND (" +
                    "   :#{#status == null || #status.isEmpty()} = true " +
                    "   OR " +
                    "   i.status IN (:status)" +
                    ") " +
                    "AND (" +
                    "   CAST(:startDate AS DATE) IS NULL " +
                    "   OR " +
                    "   i.start_date >= :startDate" +
                    ") " +
                    "AND (" +
                    "   CAST(:endDate AS DATE) IS NULL " +
                    "   OR " +
                    "   i.end_date <= :endDate" +
                    ") ")
    Page<Issues> getAllIssues(Long testPlanId, List<Long> issuesIds, String issuesName, List<String> assignIds,
                              List<Long> testCaseIds, List<Integer> priorities, List<Long> tags, List<Integer> status,
                              String startDate, String endDate, Boolean exactFilterMatch, Pageable pageable);

    @Query(nativeQuery = true, value = "select i.issues_id from issues i where i.issues_id like concat('%', :id, '%')")
    List<Long> getAllIssuesIdsContainingId(String id);

    @Query(nativeQuery = true, value = "select tcs.test_case_id " +
            "from test_case_issues tcs " +
            "join issues i " +
            "on tcs.issues_id = i.issues_id " +
            "AND tcs.test_case_id like concat('%', :id, '%')")
    List<Long> getAllTestCaseIdsContainingIdFromIssues(String id);

}
