package com.tms_run.service.Impl;

import com.tms_run.cmmn.base.PageInfo;
import com.tms_run.cmmn.util.TokenUtils;
import com.tms_run.dto.LabelDTO;
import com.tms_run.dto.LabelPage;
import com.tms_run.entity.Issues;
import com.tms_run.entity.Label;
import com.tms_run.entity.LabelEntity;
import com.tms_run.entity.TestPlan;
import com.tms_run.repository.IssuesRepository;
import com.tms_run.repository.LabelEntityRepository;
import com.tms_run.repository.LabelRepository;
import com.tms_run.repository.TestPlanRepository;
import com.tms_run.service.LabelService;
import com.tms_run.service.TestPlanService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabelServiceImpl implements LabelService {
    private final ModelMapper modelMapper;
    private final TestPlanRepository testPlanRepository;
    private final LabelRepository labelRepository;
    private final LabelEntityRepository labelEntityRepository;
    private final IssuesRepository issuesRepository;
    private final TestPlanService testPlanService;
    @Override
    public LabelDTO createLabel(LabelDTO labelDTO) {
        Label label = modelMapper.map(labelDTO, Label.class);
        TestPlan testPlan = testPlanRepository.getTestPlanByTestPlanId(labelDTO.getTestPlanId());
        label.setTestPlan(testPlan);

        label = labelRepository.save(label);
        LabelDTO toDto = modelMapper.map(label, LabelDTO.class);
        toDto.setTestPlanId(labelDTO.getTestPlanId());

        return toDto;
    }

    @Override
    public List<LabelDTO> getAllLabelsByTestPlanId(Long testPlanId) {
        List<Label> labels = labelRepository.findAllLabelsByTestPlanId(testPlanId);
        List<LabelDTO> labelsDto = labels.stream()
                .map(label -> modelMapper.map(label, LabelDTO.class))
                .collect(Collectors.toList());
        for (LabelDTO labelDto : labelsDto) {
            labelDto.setTestPlanId(testPlanId);
        }
        return labelsDto;
    }

    @Override
    public void removeLabel(List<Long> labelIds) {
        labelEntityRepository.removeLabelEntitiesByLabelIds(labelIds);
        labelRepository.removeLabelByLabelId(labelIds);
    }

    @Override
    public LabelDTO updateLabel(LabelDTO labelDTO, Long labelId) {
        Label label = labelRepository.findLabelByLabelId(labelId);
        if (labelDTO.getLabelName() != null) {
            label.setLabelName(labelDTO.getLabelName());
        }
        if (labelDTO.getLabelColor() != null) {
            label.setLabelColor(labelDTO.getLabelColor());
        }
        labelRepository.save(label);
        LabelDTO toDto = modelMapper.map(label, LabelDTO.class);
        toDto.setTestPlanId(label.getTestPlan().getTestPlanId());
        return toDto;
    }

    @Override
    public LabelPage getAllLabelByLabelTypeAndEntityId(int labelType, Long entityId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Label> labels = labelRepository.findAllLabelByLabelTypeAndEntityId(labelType, entityId, pageable);
        List<LabelDTO> labelDTOList = labels.getContent().stream()
                .map(label -> modelMapper.map(label, LabelDTO.class))
                .toList();

        for (LabelDTO labelDTO : labelDTOList) {
            labelDTO.setTestPlanId(labelRepository.getTestPlanIdByLabelId(labelDTO.getLabelId()));
        }


        PageInfo pageInfo = new PageInfo(labels.getTotalPages(), (int) labels.getTotalElements(), labels.getNumber(), labels.getSize());

        return new LabelPage(labelDTOList, pageInfo);
    }

    @Override
    public Boolean modifyLabelInIssues(String labelIds, Long issuesId) {
        Long testPlanId = issuesRepository.getTestPlanIdByIssuesId(issuesId);
        if (checkRoleMember(testPlanId) == null) return null;

        if (labelIds != null) {
            Issues issues = issuesRepository.findIssuesByIssuesId(issuesId);
            List<Long> labelsIdInThisIssues = labelRepository.finAllLabelIdsByLabelTypeAndEntityId(2, issuesId);

            if (labelIds.trim().equals("")) {
                labelEntityRepository.removeLabelEntitiesByLabelIdsAndEntityId(labelsIdInThisIssues, issuesId);
                issues.setUpdatedAt(LocalDateTime.now());
                issuesRepository.save(issues);
                return true;
            } else {
                List<Set<Long>> listOfSetOfIds = get2SetOfIdsFromLabel(labelsIdInThisIssues,
                        Arrays.stream(labelIds.split(","))
                                .map(id -> id.trim())
                                .map(Long::valueOf)
                                .collect(Collectors.toList()));

                if (!listOfSetOfIds.get(0).isEmpty()) {
                    for (Long labelId : listOfSetOfIds.get(0)) {
                        labelEntityRepository.removeLabelEntitiesByLabelIdsAndEntityId(
                                Collections.singletonList(labelId), issuesId);
                    }
                }
                if (!listOfSetOfIds.get(1).isEmpty()) {
                    for (Long labelId : listOfSetOfIds.get(1)) {
                        LabelEntity labelEntity = new LabelEntity();
                        labelEntity.setLabel(labelRepository.findLabelByLabelId(labelId));
                        labelEntity.setEntityId(issuesId);
                        labelEntityRepository.save(labelEntity);
                    }
                }
            }
            issues.setUpdatedAt(LocalDateTime.now());
            issuesRepository.save(issues);
            return true;
        }

        return false;
    }

    private String checkRoleMember(Long testPlanId) {
        String userId = TokenUtils.getUserID();
        if (testPlanService.getRoleInTestPlan(userId, testPlanId) == null && !TokenUtils.getUserRole().equals("ROLE_ADMIN")) {
            return null;
        }
        return "1";
    }

    private List<Set<Long>> get2SetOfIdsFromLabel(List<Long> oldIds, List<Long> newIds) {
        List<Set<Long>> setOfIds = new ArrayList<>();

        Set<Long> oldIdSet = new HashSet<>(oldIds);
        Set<Long> newIdSet = new HashSet<>(newIds);

        Set<Long> oldNotNewId = new HashSet<>(oldIdSet);
        oldNotNewId.removeAll(newIdSet);

        Set<Long> newNotOldId = new HashSet<>(newIdSet);
        newNotOldId.removeAll(oldIdSet);

        setOfIds.add(oldNotNewId);
        setOfIds.add(newNotOldId);
        return setOfIds;
    }
}
