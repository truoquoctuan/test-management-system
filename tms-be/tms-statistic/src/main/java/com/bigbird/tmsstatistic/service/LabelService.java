package com.tms_statistic.service;

import com.tms_statistic.dto.LabelDTO;

import java.util.List;

public interface LabelService {
    List<LabelDTO> getLabelsByTestCaseId(Long testCaseId);
}
