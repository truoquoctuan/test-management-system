package com.tms_run.repository;

import com.tms_run.entity.Label;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {

    @Query(nativeQuery = true, value = "select l.label_id, l.test_plan_id, l.label_color, l.label_name, l.label_type " +
            "from label l where label_id = ?1")
    Label findLabelByLabelId(Long id);

    @Query(nativeQuery = true, value = "select l.label_id from label l where label_type = ?1")
    List<Long> findAllLabelsIdByLabelType(int labelType);

    @Query(nativeQuery = true, value = "select le.label_id from label_entity le join label l on le.label_id = l.label_id where l.label_type = ?1 and le.entity_id = ?2;")
    List<Long> finAllLabelIdsByLabelTypeAndEntityId(int labelType, Long entityId);

    @Query(nativeQuery = true, value = "select l.label_id, l.test_plan_id, l.label_color, l.label_name, l.label_type " +
            "from label_entity le join label l on le.label_id = l.label_id where l.label_type = ?1 and le.entity_id = ?2;")
    Page<Label> findAllLabelByLabelTypeAndEntityId(int labelType, Long entityId, Pageable pageable);

    @Query(nativeQuery = true, value = "select l.label_id, l.test_plan_id, l.label_color, l.label_name, l.label_type " +
            "from label l where test_plan_id = ?1")
    List<Label> findAllLabelsByTestPlanId(Long testPlanId);

    @Query(nativeQuery = true, value = "delete from label where label_id in ?1")
    void removeLabelByLabelId(List<Long> labelIds);

    @Query(nativeQuery = true, value = "select l.test_plan_id from label l where l.label_id = ?1")
    Long getTestPlanIdByLabelId(Long labelId);
}
