package com.bigbird.tmsrepo.service;

import com.bigbird.tmsrepo.dto.LabelDTO;
import com.bigbird.tmsrepo.dto.LabelPage;

import java.util.List;

public interface LabelService {

    LabelPage getAllLabel(Long testPlanId, String labelName, List<Integer> labelTypes, Integer page, Integer size);

    LabelDTO saveLabel(LabelDTO labelDTO);

    Boolean deleteLabels(List<Long> labelIds);
}
