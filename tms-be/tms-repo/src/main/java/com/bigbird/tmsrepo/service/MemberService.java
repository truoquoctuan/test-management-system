package com.bigbird.tmsrepo.service;

import com.bigbird.tmsrepo.dto.MemberDTO;
import com.bigbird.tmsrepo.dto.MemberPage;

import java.util.List;


public interface MemberService {
    MemberPage getMemberByTestPlanId(Long testPlanId, int page, int size);

    MemberPage getMemberByTestPlanId(Long testPlanId, String name, String sorted, int page, int size);

    MemberDTO saveMemberTestPlan(MemberDTO memberDTO, Long testPlanId);

    void deleteMembers(List<Long> memberIds);

    void deleteMembersWithoutOwner(List<Long> memberIds);

}
