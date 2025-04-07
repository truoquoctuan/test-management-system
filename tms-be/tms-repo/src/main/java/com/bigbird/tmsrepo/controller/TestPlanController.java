package com.bigbird.tmsrepo.controller;

import com.bigbird.tmsrepo.dto.*;
import com.bigbird.tmsrepo.service.MemberService;
import com.bigbird.tmsrepo.service.TestPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@Validated
public class TestPlanController {
    private final TestPlanService testPlanService;
    private final MemberService memberService;

    @SchemaMapping(typeName = "Query", field = "getAllTestPlan")
    public TestPlanPage getAllTestPlan(@Argument String userId, @Argument String testPlanName, @Argument List<String> createdBys, @Argument Integer status, @Argument String sorted, @Argument int page, @Argument int size) {
        log.info("Get all test plan");
        return testPlanService.getAllTestPlan(userId, testPlanName, createdBys, status, sorted, page, size);
    }

    @SchemaMapping(typeName = "Query", field = "getTestPlanById")
    public TestPlanDTO getTestPlanById(@Argument Long testPlanId) {
        log.info("Get detail test plan");
        return testPlanService.getTestPlanById(testPlanId);
    }

    @SchemaMapping(typeName = "Mutation", field = "createTestPlan")
    public TestPlanDTO saveTestPlan(@Valid @Argument TestPlanDTO testPlan) {
        log.info("Create test plan with member");
        return testPlanService.saveTestPlan(testPlan);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateInfoTestPlan")
    public TestPlanDTO updateInfoTestPlan(@Argument TestPlanDTO testPlan) {
        log.info("Update info testPlan");
        return testPlanService.saveTestPlan(testPlan);
    }

    @SchemaMapping(typeName = "Mutation", field = "disableTestPlans")
    public List<TestPlanDTO> disableTestPlans(@Argument List<TestPlanDTO> testPlans) {
        log.info("Disable a lot of testPlan");
        return testPlanService.disableTestPlans(testPlans);
    }

    @SchemaMapping(typeName = "Mutation", field = "pinTestPlan")
    public TestPlanDTO pinTestPlan(@Argument Long testPlanId, @Argument String userId, @Argument Boolean isPin) {
        log.info("Set pin test plan");
        return testPlanService.pinTestPlan(testPlanId, userId, isPin);
    }

    @SchemaMapping(typeName = "Query", field = "getMembersByTestPlanId")
    public MemberPage getMembersByTestPlanId(@Argument Long testPlanId, @Argument String name, @Argument String sorted, @Argument int page, @Argument int size) {
        log.info("Get member by testPlanId");
        return testPlanService.getMemberByTestPlanId(testPlanId, name, sorted, page, size);
    }

    @SchemaMapping(typeName = "Query", field = "getMembersByTestPlanIdInEdit")
    public MemberPage getMembersByTestPlanIdInEdit(@Argument Long testPlanId, @Argument String name) {
        log.info("Get member by testPlanId");
        return testPlanService.getMembersByTestPlanIdInEdit(testPlanId, name);
    }

    @SchemaMapping(typeName = "Mutation", field = "saveMemberTestPlan")
    public List<MemberDTO> saveMemberTestPlan(@Argument Long testPlanId, @Argument List<MemberDTO> members) {
        log.info("Add member to test plan");
        return testPlanService.saveMember(testPlanId, members);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteMembersOnTestPlan")
    public String deleteMembersOnTestPlan(@Argument List<Long> memberIds) {
        log.info("Delete member on test plan");
        memberService.deleteMembers(memberIds);
        return "Deleted!!!";
    }

    @SchemaMapping(typeName = "Query", field = "getCreator")
    public UserPage getCreator(@Argument String userId, @Argument String name, @Argument Integer page, @Argument Integer size) {
        log.info("Get creator");
        return testPlanService.getCreator(userId, name, page, size);
    }

    @SchemaMapping(typeName = "Query", field = "getRoleInTestPlan")
    public Integer getRoleInTestPlan(@Argument String userId, @Argument Long testPlanId) {
        log.info("Get role testplan for user");
        return testPlanService.getRoleInTestPlan(userId, testPlanId);
    }

}
