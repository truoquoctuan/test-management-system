package com.tms_run.repository;

import com.tms_run.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    @Query(value = "select m.userId from Member m where m.testPlan.testPlanId = :testPlanId")
    List<String> getUserIdInTestPlan(Long testPlanId);

}
