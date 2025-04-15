package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.Pin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PinRepository extends JpaRepository<Pin, Long> {

    @Query("select p from Pin p where p.testPlan.testPlanId = :testPlanId and p.userId = :userId")
    Pin getPinByTestPlanIdAndUserId(Long testPlanId, String userId);
    
}
