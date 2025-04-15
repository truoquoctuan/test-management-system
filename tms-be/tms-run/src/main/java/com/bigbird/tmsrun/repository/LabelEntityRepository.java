package com.tms_run.repository;

import com.tms_run.entity.LabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabelEntityRepository extends JpaRepository<LabelEntity, Long> {

    @Query(nativeQuery = true, value = "delete from label_entity where label_id in ?1 and entity_id = ?2")
    void removeLabelEntitiesByLabelIdsAndEntityId(List<Long> labelId, Long entityId);

    @Query(nativeQuery = true, value = "delete from label_entity where label_id in ?1")
    void removeLabelEntitiesByLabelIds(List<Long> labelIds);

}
