package com.tms_statistic.service.Impl;

import com.tms_statistic.cmmn.exception.ResourceNotFoundException;
import com.tms_statistic.dto.LabelDTO;
import com.tms_statistic.entity.Label;
import com.tms_statistic.repository.LabelRepository;
import com.tms_statistic.service.LabelService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class LabelServiceImpl implements LabelService {
    private final LabelRepository labelRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<LabelDTO> getLabelsByTestCaseId(Long testCaseId) {
        try {
            List<Label> labels = labelRepository.getLabelByTestCaseId(testCaseId);
            if (!labels.isEmpty()) {
                return labels.stream().map(label -> modelMapper.map(label, LabelDTO.class)).filter(Objects::nonNull).toList();
            }
            return null;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get all label by testcaseId: ", testCaseId);
        }
    }
}
