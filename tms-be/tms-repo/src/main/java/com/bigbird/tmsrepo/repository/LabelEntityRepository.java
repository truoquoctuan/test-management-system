package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.LabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LabelEntityRepository extends JpaRepository<LabelEntity, Long> {

    @Query(nativeQuery = true, value = "select label_entity_id from label_entity where label_id = ?1 and entity_id = ?2")
    Long findTestCaseLabelIdByIds(Long labelId, Long testCaseId);

    @Query(nativeQuery = true, value = "select le.label_id from label_entity le " +
            "inner join label l on l.label_id = le.label_id and l.label_type = 1 " +
            "where le.entity_id = ?1 ")
    List<Long> findLabelIdByTestCaseId(Long id);

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "DELETE FROM label_entity " +
            "WHERE label_entity_id IN (" +
            "SELECT le.label_entity_id FROM test_case tc " +
            "INNER JOIN label_entity le ON le.entity_id = tc.test_case_id " +
            "INNER JOIN label l ON l.label_id = le.label_id AND l.label_type = 1 " +
            "WHERE tc.test_case_id = :testCaseId)")
    void deleteLabelByTestCaseId(Long testCaseId);

    @Query(nativeQuery = true, value = "SELECT case when EXISTS ( " +
            "SELECT le.label_entity_id FROM label_entity le WHERE le.label_id = ?1 " +
            ") then 1 ELSE 0 END")
    Integer isExistsLabelEntitiesByLabelId(Long labelId);

}
