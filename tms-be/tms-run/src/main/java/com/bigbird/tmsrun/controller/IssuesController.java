package com.tms_run.controller;

import com.tms_run.cmmn.config.RabbitConfig.IssuesCauseSolutionSender;
import com.tms_run.dto.*;
import com.tms_run.service.IssuesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class IssuesController {
    private final IssuesCauseSolutionSender issuesCauseSolutionSender;
    private final IssuesService issuesService;

    @SchemaMapping(typeName = "Mutation", field = "saveCauseSolution")
    public Boolean saveCauseSolution(@Argument Long issuesId, @Argument String cause, @Argument String solution) {
        log.info("save cause and solution");
        return issuesService.saveCauseSolution(issuesId, cause, solution);
    }

    @SchemaMapping(typeName = "Query", field = "getCauseAndSolution")
    public CauseSolutionDTO getCauseAndSolution(@Argument Long issuesId) {
        log.info("get cause and solution");
        Map<String, String> causeSolutionMap = issuesCauseSolutionSender.getCauseSolution(issuesId);
        return new CauseSolutionDTO(causeSolutionMap.get("cause"), causeSolutionMap.get("solution"));
    }

    @SchemaMapping(typeName = "Mutation", field = "createIssues")
    public Boolean createIssues(@Argument IssuesCreateDTO input) {
        return issuesService.createIssues(input);
    }

    @QueryMapping
    public IssuesDTO getIssuesById(@Argument Long issuesId) {
        return issuesService.getIssuesById(issuesId);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateIssuesStatus")
    public void updateIssuesStatus(@Argument Long issuesId, @Argument int status, @Argument String userId) {
        issuesService.updateIssuesStatus(issuesId, status, userId);
    }

    @SchemaMapping(typeName = "Mutation", field = "removeIssues")
    public void removeIssues(@Argument List<Long> issuesIds) {
        issuesService.removeIssues(issuesIds);
    }

    @SchemaMapping(typeName = "Query", field = "getAllIssuesInTestPlan")
    public IssuesPage getAllIssuesInTestPlan(@Argument("input") IssuesFilterDTO issuesFilterDTO, @Argument String sorted, @Argument Integer page, @Argument Integer size) {
        log.info("Get search filter issues");
        return issuesService.getAllIssues(issuesFilterDTO, sorted, page, size);
    }

    @SchemaMapping(typeName = "Mutation", field = "modifyIssues")
    public Boolean modifyIssues(@Argument("input") IssuesModifyDTO issuesModifyDTO) {
        return issuesService.modifyIssues(issuesModifyDTO);
    }

    @SchemaMapping(typeName = "Mutation", field = "modifyAssigns")
    public Boolean modifyAssigns(@Argument String assignIds, @Argument Long issuesId, @Argument String userId) {
        return issuesService.modifyAssigns(assignIds, issuesId, userId);
    }

    @SchemaMapping(typeName = "Mutation", field = "modifyTestCases")
    public Boolean modifyTestCases(@Argument String testCaseIds, @Argument Long issuesId) {
        return issuesService.modifyTestCases(testCaseIds, issuesId);
    }

    @SchemaMapping(typeName = "Mutation", field = "modifyEndDate")
    public Boolean modifyEndDate(@Argument String endDate, @Argument Long issuesId) {
        return issuesService.modifyEndDate(endDate, issuesId);
    }

    @SchemaMapping(typeName = "Mutation", field = "modifyStartDate")
    public Boolean modifyStartDate(@Argument String startDate, @Argument Long issuesId) {
        return issuesService.modifyStartDate(startDate, issuesId);
    }

    @SchemaMapping(typeName = "Mutation", field = "modifyPriority")
    public Boolean modifyPriority(@Argument Integer priority, @Argument Long issuesId) {
        return issuesService.modifyPriority(priority, issuesId);
    }
}
