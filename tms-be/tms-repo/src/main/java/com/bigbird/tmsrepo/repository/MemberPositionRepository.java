package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.MemberPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface MemberPositionRepository extends JpaRepository<MemberPosition, Long> {
    @Query(nativeQuery = true, value = "SELECT member_position_id, member_id, position_id FROM `member_position` WHERE member_id = :memberId;")
    List<MemberPosition> getMemberPositionByMemberId(@Param("memberId") Long memberId);

    @Query(nativeQuery = true, value = "DELETE FROM `member_position` WHERE member_id = ?1;")
    void deleteMemberPositionByMemberId(Long memberId);
}
