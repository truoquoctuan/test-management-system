package com.tms_run.repository;

import com.tms_run.entity.Assign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignRepository extends JpaRepository<Assign, Long> {
    @Query("select distinct a.userId from Assign a where a.entityId = :entityId and a.assignType = :type")
    List<String> getUserIdByEntityIdAndType(Long entityId, Integer type);

    @Modifying
    @Query(value = "insert into assign (user_id, assign_type, entity_id, assign_date) " +
            "values (?1, ?2, ?3, NOW())", nativeQuery = true)
    void saveAssign(String userId, Integer assignType, Long entityId);

    @Modifying
    @Query(nativeQuery = true, value = "delete from assign where entity_id = ?1 and assign_type = ?2")
    void removeAssignsByEntityIdAndType(Long entityId, Integer type);

    @Query(nativeQuery = true, value = "delete from assign where user_id = ?1 and entity_id = ?2 and assign_type = ?3")
    void removeAssignsByUserIdAndEntityIdAndType(String userId, Long entityId, Integer type);

    @Modifying
    @Query(nativeQuery = true, value = "delete from assign where user_id is null and entity_id = ?1 and assign_type = ?2")
    void removeAssignsByUserIdNullAndEntityIdAndType(Long entityId, Integer type);

}
