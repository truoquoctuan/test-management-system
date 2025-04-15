package com.tms_statistic.repository;

import com.tms_statistic.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {
    @Query(nativeQuery = true, value = "select l.label_id, l.label_color, l.label_name, l.test_plan_id, l.label_type from label l " +
            "inner join label_entity le on le.label_id = l.label_id " +
            "where le.entity_id = :testCaseId " +
            "and l.label_type = 1")
    List<Label> getLabelByTestCaseId(@Param("testCaseId") Long testCaseId);


    @Query(nativeQuery = true, value = "select le.label_id from label_entity le join label l on le.label_id = l.label_id where l.label_type = ?1 and le.entity_id = ?2;")
    List<Long> finAllLabelIdsByLabelTypeAndEntityId(int labelType, Long entityId);

    @Query(value = "select l.labelName from Label l where l.labelId = :labelId")
    String getLabelNameByLabelId(Long labelId);
}
