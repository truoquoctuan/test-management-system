package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    @Query(nativeQuery = true, value = "SELECT m.member_id, m.add_by, m.role_test_plan, m.user_id, m.test_plan_id, m.added_at FROM `member` as m " +
            "WHERE test_plan_id = :testPlanId")
    Page<Member> getMemberByTestPlanId(Long testPlanId, Pageable pageable);

    @Query(nativeQuery = true, value = "SELECT m.member_id, m.add_by, m.role_test_plan, m.user_id, m.test_plan_id, m.added_at FROM `member` as m " +
            "WHERE m.test_plan_id = :testPlanId and m.user_id in :userIds")
    Page<Member> getMemberByTestPlanIdAndUserIds(Long testPlanId, List<String> userIds, Pageable pageable);

    @Query(nativeQuery = true, value = "SELECT m.member_id, m.add_by, m.role_test_plan, m.user_id, m.test_plan_id, m.added_at FROM `member` as m " +
            "WHERE test_plan_id = :testPlanId")
    List<Member> getMemberByTestPlanId(@Param("testPlanId") Long testPlanId);

    @Query(nativeQuery = true, value = "DELETE FROM `member` WHERE member_id = ?1;")
    void deleteMemberOnTestPlanId(Long memberId);

    @Query(nativeQuery = true, value = "SELECT m.member_id, m.add_by, m.role_test_plan, m.user_id, m.test_plan_id, m.added_at FROM `member` m " +
            "WHERE m.test_plan_id = :testPlanId AND m.user_id = :userId")
    Member getMemberByTestPlanIdAndUserId(@Param("testPlanId") Long testPlanId, @Param("userId") String userId);

    @Query(nativeQuery = true, value = "SELECT m.member_id, m.add_by, m.role_test_plan, m.user_id, m.test_plan_id, m.added_at FROM member m " +
            "WHERE m.member_id = :memberId")
    Member getMemberByMemberId(@Param("memberId") Long memberId);

}
