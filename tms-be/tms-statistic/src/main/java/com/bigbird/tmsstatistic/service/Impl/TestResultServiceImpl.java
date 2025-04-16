package com.tms_statistic.service.Impl;

import com.tms_statistic.cmmn.exception.ResourceNotFoundException;
import com.tms_statistic.dto.TestResultDTO;
import com.tms_statistic.entity.TestResult;
import com.tms_statistic.entity.Users;
import com.tms_statistic.repository.AssignRepository;
import com.tms_statistic.repository.TestResultRepository;
import com.tms_statistic.service.TestResultService;
import com.tms_statistic.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TestResultServiceImpl implements TestResultService {
    private final TestResultRepository testResultRepository;
    private final ModelMapper modelMapper;
    private final UsersService usersService;
    private final AssignRepository assignRepository;

    @Override
    public List<TestResultDTO> getTestResultByTestCaseId(Long testCaseId) {
        try {
            List<TestResult> testResults = testResultRepository.getTestResultsByTestCaseId(testCaseId);
            return testResults.stream().map(testResult -> {
                TestResultDTO testResultDTO = modelMapper.map(testResult, TestResultDTO.class);
                if (testResult.getUserId() != null) {
                    Users users = usersService.findUserById(testResult.getUserId());
                    testResultDTO.setCreator(users);
                }
                List<String> assignIds = assignRepository.getUserIdByEntityIdAndType(testResult.getTestResultId(), 1);
                List<Users> assignUsers = null;
                if (!assignIds.isEmpty()) {
                    assignIds.forEach(assignId -> {
                        Users users = usersService.findUserById(assignId);
                        assignUsers.add(users);
                    });
                }
                testResultDTO.setAssignUsers(assignUsers);
                return testResultDTO;
            }).toList();
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not get test result by test case id: ", testCaseId);
        }
    }

    @Override
    public TestResultDTO getLastTestResultByTestCaseId(Long testCaseId) {
        try {
            TestResult testResult = testResultRepository.getLastTestResultByTestCaseId(testCaseId);
            if (testResult != null) {
                TestResultDTO testResultDTO = modelMapper.map(testResult, TestResultDTO.class);
                if (testResult.getUserId() != null) {
                    Users users = usersService.findUserById(testResult.getUserId());
                    testResultDTO.setCreator(users);
                }
                List<String> assignUserIds = assignRepository.getUserIdByEntityIdAndType(testResult.getTestResultId(), 1);
                List<Users> assignUsers = new ArrayList<>();
                if (assignUserIds != null && !assignUserIds.isEmpty()) {
                    assignUserIds.forEach(assignId -> {
                        Users users = usersService.findUserById(assignId);
                        assignUsers.add(users);
                    });
                }
                testResultDTO.setAssignUsers(assignUsers);
                return testResultDTO;
            }
            return null;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not get test result by test case id: ", testCaseId);
        }
    }
}
