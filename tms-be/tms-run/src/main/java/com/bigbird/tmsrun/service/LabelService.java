package com.tms_run.service;

import com.tms_run.dto.LabelDTO;
import com.tms_run.dto.LabelPage;

import java.util.List;

public interface LabelService {
    LabelDTO createLabel(LabelDTO labelDTO);
    List<LabelDTO> getAllLabelsByTestPlanId(Long testPlanId);
    void removeLabel(List<Long> labelIds);
    LabelDTO updateLabel(LabelDTO labelDTO, Long labelId);
    LabelPage getAllLabelByLabelTypeAndEntityId(int labelType, Long entityId, int page, int size);
    Boolean modifyLabelInIssues(String labelIds, Long issuesId);
}
