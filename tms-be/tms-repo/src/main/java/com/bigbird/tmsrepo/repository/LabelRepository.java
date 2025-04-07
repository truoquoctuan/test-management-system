package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.Label;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {

    @Query(nativeQuery = true, value = "select * from label where label_id = ?1")
    Label findLabelById(Long labelId);

    @Query(nativeQuery = true, value = "select l.label_id, l.label_name, l.label_color, l.test_plan_id, l.label_type from `label` l " +
            "where l.test_plan_id = :testPlanId " +
            "and (:labelName is NULL or l.label_name LIKE concat('%', :labelName, '%')) " +
            "and (:#{#labelTypes == null || #labelTypes.isEmpty()} = true or l.label_type in (:labelTypes)) ")
    Page<Label> getAllLabel(Long testPlanId, String labelName, List<Integer> labelTypes, Pageable pageable);
}
