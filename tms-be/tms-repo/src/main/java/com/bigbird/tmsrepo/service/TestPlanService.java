package com.bigbird.tmsrepo.service;

import com.bigbird.tmsrepo.dto.*;

import java.util.List;

public interface TestPlanService {
    TestPlanPage getAllTestPlan(String userId, String name, List<String> createdBys, Integer status, String sorted, int page, int size);

    TestPlanDTO getTestPlanById(Long id);

    TestPlanDTO saveTestPlan(TestPlanDTO testPlanDTO);

    List<MemberDTO> saveMember(Long testPlanId, List<MemberDTO> memberDTOS);

    List<TestPlanDTO> disableTestPlans(List<TestPlanDTO> testPlanDTOs);

    TestPlanDTO pinTestPlan(Long testPlanId, String userId, Boolean isPin);

    MemberPage getMemberByTestPlanId(Long testPlanId, String name, String sorted, int page, int size);

    UserPage getCreator(String userId, String name, Integer page, Integer size);

    Integer getRoleInTestPlan(String userId, Long testPlanId);

    MemberPage getMembersByTestPlanIdInEdit(Long testPlanId, String name);
}
