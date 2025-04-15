package com.bigbird.tmsrepo.service.Impl;

import com.bigbird.tmsrepo.cmmn.base.BaseCrudService;
import com.bigbird.tmsrepo.cmmn.base.PageInfo;
import com.bigbird.tmsrepo.cmmn.exception.ResourceNotFoundException;
import com.bigbird.tmsrepo.dto.LabelDTO;
import com.bigbird.tmsrepo.dto.LabelPage;
import com.bigbird.tmsrepo.entity.Label;
import com.bigbird.tmsrepo.entity.TestPlan;
import com.bigbird.tmsrepo.repository.LabelEntityRepository;
import com.bigbird.tmsrepo.repository.LabelRepository;
import com.bigbird.tmsrepo.repository.TestPlanRepository;
import com.bigbird.tmsrepo.service.LabelService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabelServiceImpl extends BaseCrudService<Label, Long> implements LabelService {

    private final LabelRepository labelRepository;
    private final ModelMapper modelMapper;
    private final TestPlanRepository testPlanRepository;
    private final LabelEntityRepository labelEntityRepository;

    @Override
    public LabelPage getAllLabel(Long testPlanId, String labelName, List<Integer> labelTypes, Integer page, Integer size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Label> labels = labelRepository.getAllLabel(testPlanId, labelName, labelTypes, pageable);
            List<LabelDTO> labelDTOS = labels.stream().map((element) -> modelMapper.map(element, LabelDTO.class)).collect(Collectors.toList());
            PageInfo pageInfo = new PageInfo(labels.getTotalPages(), (int) labels.getTotalElements(), labels.getNumber(), labels.getSize());
            return new LabelPage(labelDTOS, pageInfo);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to get all label by testPlanId: ", testPlanId);
        }
    }

    @Override
    public LabelDTO saveLabel(LabelDTO labelDTO) {
        Long testPlanId = labelDTO.getTestPlanId();
        Label label = modelMapper.map(labelDTO, Label.class);
        if (testPlanId != null) {
            TestPlan testPlan = testPlanRepository.findById(testPlanId).get();
            label.setTestPlan(testPlan);
            labelRepository.save(label);
        }
        labelDTO = modelMapper.map(label, LabelDTO.class);
        labelDTO.setTestPlanId(testPlanId);

        updateTestPlanUpdateTime(testPlanId);

        return labelDTO;
    }

    @Override
    public Boolean deleteLabels(List<Long> labelIds) {
        int flag = 0;
        for (Long labelId : labelIds) {
            if (labelRepository.existsById(labelId) && labelEntityRepository.isExistsLabelEntitiesByLabelId(labelId) == 0) {
                labelRepository.deleteById(labelId);
                flag++;
            }
        }
        if (flag == labelIds.size()) {
            updateTestPlanUpdateTime(labelRepository.findLabelById(labelIds.get(0)).getTestPlan().getTestPlanId());
            return true;
        }
        return false;
    }

    private void updateTestPlanUpdateTime(Long testPlanId) {
        TestPlan testPlan = testPlanRepository.getTestPlanById(testPlanId);
        testPlan.setUpdatedAt(LocalDateTime.now());
        testPlanRepository.save(testPlan);
    }
}
