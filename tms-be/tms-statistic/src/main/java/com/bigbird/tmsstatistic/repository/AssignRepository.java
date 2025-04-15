package com.tms_statistic.repository;

import com.tms_statistic.entity.Assign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignRepository extends JpaRepository<Assign, Long> {

    @Query("select distinct a.userId from Assign a where a.entityId = :entityId and a.assignType = :type")
    List<String> getUserIdByEntityIdAndType(Long entityId, Integer type);
}
