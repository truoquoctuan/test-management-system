package com.tms_run.service.Impl;

import com.tms_run.cmmn.exception.ResourceNotFoundException;
import com.tms_run.cmmn.util.TokenUtils;
import com.tms_run.repository.TestPlanRepository;
import com.tms_run.service.TestPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class TestPlanServiceImpl implements TestPlanService {

    private final TestPlanRepository testPlanRepository;

    @Override
    public String getRoleInTestPlan(String userId, Long testPlanId) {
        try {
            if (testPlanRepository.existsById(testPlanId)) {
                String authResponse = TokenUtils.getUserRole();
                if (authResponse.equals("ROLE_ADMIN")) {
                    return "1";
                }
                return testPlanRepository.getRoleInTestPlan(userId, testPlanId).toString();
            }
            return null;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get role in test plan by userId: ", userId);
        }
    }
}
