package com.tms_run.service;

import com.tms_run.dto.*;

import java.util.List;

public interface IssuesService {
    Boolean createIssues(IssuesCreateDTO issuesCreateDTO);
    IssuesDTO getIssuesById(Long issuesId);
    Boolean modifyIssues(IssuesModifyDTO issuesModifyDTO);
    Boolean modifyAssigns(String assignIds, Long issuesId, String userId);
    Boolean modifyTestCases(String testCaseIds, Long issuesId);
    Boolean modifyStartDate(String startDateStr, Long issuesId);
    Boolean modifyEndDate(String endDateStr, Long issuesId);
    Boolean modifyPriority(Integer priority, Long issuesId);
    void updateIssuesStatus(Long issuesId, int status, String userId);
    void removeIssues(List<Long> issuesIds);
    IssuesPage getAllIssues(IssuesFilterDTO filterDTO, String sorted, Integer page, Integer size);
    Boolean saveCauseSolution(Long issuesId, String cause, String solution);
    CauseSolutionDTO getCauseAndSolution(Long issuesId);
    void notifyForSaveCauseAndSolution(Long issuesId);
}
