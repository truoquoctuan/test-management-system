package com.bigbird.tmsrepo.service.Impl;

import com.bigbird.tmsrepo.cmmn.base.BaseCrudService;
import com.bigbird.tmsrepo.cmmn.base.BaseEntity;
import com.bigbird.tmsrepo.cmmn.base.PageInfo;
import com.bigbird.tmsrepo.cmmn.exception.ResourceNotFoundException;
import com.bigbird.tmsrepo.dto.*;
import com.bigbird.tmsrepo.entity.*;
import com.bigbird.tmsrepo.repository.*;
import com.bigbird.tmsrepo.service.FileService;
import com.bigbird.tmsrepo.service.TestCaseService;
import com.bigbird.tmsrepo.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestCaseServiceImpl extends BaseCrudService<TestCase, Long> implements TestCaseService {
    private final ModelMapper modelMapper;
    private final UsersService usersService;
    private final FolderRepository folderRepository;
    private final TestCaseRepository testCaseRepository;
    private final LabelRepository labelRepository;
    private final LabelEntityRepository labelEntityRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;
    private final TestPlanRepository testPlanRepository;

    @Override
    public TestCaseDTO createTestCase(TestCaseDTO testCaseDTO) {
        try {
            // save test case
            TestCase testCase = modelMapper.map(testCaseDTO, TestCase.class);
            testCase.setStatus(5);
            testCase.setFolder(folderRepository.getFolderByFolderId(testCaseDTO.getFolderId()));
            testCaseRepository.save(testCase);

            // save label
            if (!testCaseDTO.getLabels().isEmpty()) {
                for (TestCaseLabelDTO label : testCaseDTO.getLabels()) {
                    LabelEntity labelEntity = new LabelEntity();
                    labelEntity.setEntityId(testCase.getTestCaseId());
                    labelEntity.setLabel(labelRepository.findLabelById(label.getLabelId()));
                    labelEntityRepository.save(labelEntity);
                }
            }

            // update file's group id
            String uploadKey = ((BaseEntity) testCase).getUploadKey();
            if (StringUtils.isNotEmpty(uploadKey)) {
                String groupId = String.format("%s-%s", testCase.getClass().getSimpleName(), ((BaseEntity) testCase).getSeq());
                fileService.updateGroupId(uploadKey, groupId);
            }

            TestCaseDTO dto = modelMapper.map(testCase, TestCaseDTO.class);
            dto.setFolderId(testCase.getFolder().getFolderId());
            dto.setLabels(testCaseDTO.getLabels());

            updateTestPlanUpdateTime(testCase.getFolder().getTestPlan().getTestPlanId());

            return dto;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to create test case", testCaseDTO);
        }
    }

    @Override
    public void createTestCases(Long folderId, List<TestCaseDTO> testCases) {
        try {
            Folder folder = folderRepository.getFolderByFolderId(folderId);
            for (TestCaseDTO testCaseDTO : testCases) {
                TestCase testCase = modelMapper.map(testCaseDTO, TestCase.class);
                testCase.setFolder(folder);
                testCaseRepository.save(testCase);
            }
            updateTestPlanUpdateTime(folder.getTestPlan().getTestPlanId());

        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to create test case in folderId: ", folderId);
        }
    }

    @Override
    public TestCaseDTO updateTestCaseById(TestCaseDTO testCaseDTO) {
        try {
            if (!testCaseRepository.existsById(testCaseDTO.getTestCaseId())) {
                throw new ResourceNotFoundException("Test case", "ID", testCaseDTO.getTestCaseId());
            }

            TestCase testCase = testCaseRepository.findById(testCaseDTO.getTestCaseId()).get();

            if (testCaseDTO.getTestCaseName() != null) {
                testCase.setTestCaseName(testCaseDTO.getTestCaseName());
            }
            if (testCaseDTO.getDescription() != null) {
                testCase.setDescription(testCaseDTO.getDescription());
            }
            if (testCaseDTO.getExpectResult() != null) {
                testCase.setExpectResult(testCaseDTO.getExpectResult());
            }
            if (testCaseDTO.getPriority() != null) {
                testCase.setPriority(testCaseDTO.getPriority());
            }
            if (testCaseDTO.getFileSeqs() != null) {
                testCase.setFileSeqs(testCaseDTO.getFileSeqs());
            }
            testCase.setUpdatedAt(LocalDateTime.now());
            TestCase result = testCaseRepository.save(testCase);

            // update file's group id
            String uploadKey = ((BaseEntity) result).getUploadKey();
            if (StringUtils.isNotEmpty(uploadKey)) {
                String groupId = String.format("%s-%s", result.getClass().getSimpleName(), ((BaseEntity) result).getSeq());
                fileService.updateGroupId(uploadKey, groupId);
            }

            // update label
            if (!testCaseDTO.getLabels().isEmpty()) {
                labelEntityRepository.deleteLabelByTestCaseId(testCaseDTO.getTestCaseId());
                for (TestCaseLabelDTO label : testCaseDTO.getLabels()) {
                    LabelEntity testCaseLabel = new LabelEntity();
                    testCaseLabel.setEntityId(testCase.getTestCaseId());
                    testCaseLabel.setLabel(labelRepository.findLabelById(label.getLabelId()));
                    labelEntityRepository.save(testCaseLabel);
                }
            }

            TestCaseDTO dto = modelMapper.map(testCase, TestCaseDTO.class);
            dto.setFolderId(testCase.getFolder().getFolderId());
            dto.setLabels(testCaseDTO.getLabels());

            updateTestPlanUpdateTime(result.getFolder().getTestPlan().getTestPlanId());

            return dto;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to update test case", testCaseDTO);
        }
    }

    @Override
    public StatusDTO deleteTestCaseById(List<Long> ids) {
        try {
            for (Long id : ids) {
                if (testCaseRepository.existsById(id)) {
                    deleteTestCaseByTestCaseId(id);
                    testCaseRepository.removeCommentsByTestCaseIdAndType(id, 1);
                } else {
                    return new StatusDTO(false, "Test case not found");
                }
            }
            updateTestPlanUpdateTime(
                    testCaseRepository.findTestCaseById(ids.get(0)).getFolder().getTestPlan().getTestPlanId());

            return new StatusDTO(true, "Test case deleted successfully");
        } catch (Exception e) {
            return new StatusDTO(false, "Failed to delete test case: " + e.getMessage());
        }
    }

    public void deleteTestCaseByTestCaseId(Long testCaseId){
        try {
            testCaseRepository.deleteById(testCaseId);
        }catch (Exception e){

        }
    }

    @Override
    public Optional<TestCaseDTO> getTestCaseById(Long id) {

        if (!testCaseRepository.existsById(id)) {
            return Optional.empty();
        }

        TestCase testCase = testCaseRepository.findTestCaseById(id);

        TestCaseDTO testCaseDTO = modelMapper.map(testCase, TestCaseDTO.class);
        testCaseDTO.setFolderId(testCase.getFolder().getFolderId());

        Users user = usersService.findUserDisabledById(testCase.getCreatedBy());
        testCaseDTO.setFullName(user.getFullName());
        testCaseDTO.setUserName(user.getUserName());

        List<LabelDTO> labelDTOList = new ArrayList<>();
        // list label_id của test_case_id
        List<Long> labelIds = labelEntityRepository.findLabelIdByTestCaseId(id);
        for (Long labelId : labelIds) {
            Label label = labelRepository.findLabelById(labelId);
            LabelDTO labelDTO = new LabelDTO();
            labelDTO.setLabelId(label.getLabelId());
            labelDTO.setLabelName(label.getLabelName());
            labelDTO.setLabelColor(label.getLabelColor());
            labelDTOList.add(labelDTO);
        }
        if (!labelDTOList.isEmpty()) {
            testCaseDTO.setLabelsInfo(labelDTOList);
        }

        List<AttachFileDTO> attachFileList = new ArrayList<>();
        if (testCaseDTO.getFileSeqs() != null && !testCaseDTO.getFileSeqs().isEmpty()) {
            String[] fileSeq = testCaseDTO.getFileSeqs().split(",");
            for (String seq : fileSeq) {
                AttachFile attachFile = fileRepository.findByFileSeq(Long.valueOf(seq));
                AttachFileDTO attachFileDTO = modelMapper.map(attachFile, AttachFileDTO.class);
                attachFileList.add(attachFileDTO);
            }
        }
        if (!attachFileList.isEmpty()) {
            testCaseDTO.setFiles(attachFileList);
        }

//        List<AttachFileDTO> attachFileList = fileRepository.findByGroupId("TestCase-" + id);
//        if (!attachFileList.isEmpty()) {
//            testCaseDTO.setFiles(attachFileList);
//        }

        return Optional.of(testCaseDTO);
    }

    @Override
    public StatusDTO updateLabelInTestCase(Long labelId, Long testCaseId, String flag) {
        try {
            if (flag.equals("add")) {
                LabelEntity testCaseLabel = new LabelEntity();
                testCaseLabel.setLabel(labelRepository.findLabelById(labelId));
                testCaseLabel.setEntityId(testCaseId);
                labelEntityRepository.save(testCaseLabel);
                return new StatusDTO(true, "Label added successfully");
            } else {
                Long testCaseLabelId = labelEntityRepository.findTestCaseLabelIdByIds(labelId, testCaseId);
                labelEntityRepository.deleteById(testCaseLabelId);
                return new StatusDTO(true, "Label deleted successfully");
            }
        } catch (Exception e) {
            return new StatusDTO(false, "Failed to add/delete label in test case: " + e.getMessage());
        }
    }

    @Override
    public TestCasePage getAll(Long folderId, String testCaseName, List<String> createdBys, List<Long> labelIds, String sorted, Integer page, Integer size) {
        try {
            if (testCaseName != null) testCaseName = testCaseName.trim();
            Pageable pageable = PageRequest.of(page, size, parseSortString(sorted));
            Page<TestCase> testCases = testCaseRepository.getAllByFolderId(folderId, testCaseName, createdBys, labelIds, pageable);
            List<TestCaseDTO> testCaseDTOS = testCases.stream().map((element) -> modelMapper.map(element, TestCaseDTO.class)).collect(Collectors.toList());
            PageInfo pageInfo = new PageInfo(testCases.getTotalPages(), (int) testCases.getTotalElements(), testCases.getNumber(), testCases.getSize());
            return new TestCasePage(testCaseDTOS, pageInfo);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to get all test_case by folderId: ", folderId);
        }
    }

    @Override
    public TestCasePage getAllTestCaseByTestPlanIdWithSearch(Long testCaseId, String testCaseName, Long testPlanId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Long> folderIdRunning = folderRepository.getAllFolderIdRunningIncludingChildrenInTestPlanId(testPlanId);
        Page<TestCase> testCaseList = testCaseRepository.getAllTestCaseByTestPlanIdWithSearch(folderIdRunning, testCaseId, testCaseName, testPlanId, pageable);
        List<TestCaseDTO> testCaseDTOList = new ArrayList<>();
        List<TestCase> testCases = testCaseList.getContent();

        for (TestCase testCase : testCases) {
            TestCaseDTO testCaseDTO = modelMapper.map(testCase, TestCaseDTO.class);
            testCaseDTOList.add(testCaseDTO);
        }

        PageInfo pageInfo = new PageInfo(testCaseList.getTotalPages(), (int) testCaseList.getTotalElements(), testCaseList.getNumber(), testCaseList.getSize());
        return new TestCasePage(testCaseDTOList, pageInfo);
    }

    private Sort parseSortString(String sort) {
        if (sort == null || sort.isEmpty()) {
            return Sort.unsorted();
        }
        String[] sortParams = sort.split("\\+");
        String fieldName = sortParams[0];
        String direction = sortParams.length > 1 ? sortParams[1].toUpperCase() : "ASC";

        if (!direction.equals("ASC") && !direction.equals("DESC")) {
            direction = "ASC";  // Default to asc
        }

        return Sort.by(Sort.Direction.valueOf(direction), fieldName);
    }

    private void updateTestPlanUpdateTime(Long testPlanId) {
        TestPlan testPlan = testPlanRepository.getTestPlanById(testPlanId);
        testPlan.setUpdatedAt(LocalDateTime.now());
        testPlanRepository.save(testPlan);
    }

}
