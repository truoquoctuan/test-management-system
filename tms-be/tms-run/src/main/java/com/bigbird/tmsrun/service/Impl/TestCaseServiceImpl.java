package com.tms_run.service.Impl;

import com.tms_run.cmmn.base.BaseCrudService;
import com.tms_run.cmmn.base.PageInfo;
import com.tms_run.cmmn.exception.ResourceNotFoundException;
import com.tms_run.dto.TestCaseDTO;
import com.tms_run.dto.TestCasePage;
import com.tms_run.entity.TestCase;
import com.tms_run.repository.TestCaseRepository;
import com.tms_run.service.TestCaseService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestCaseServiceImpl extends BaseCrudService<TestCase, Long> implements TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ModelMapper modelMapper;

    @Override
    public TestCasePage getAllTestCase(Long folderId, String searchString, List<String> createdBys, List<Long> labelIds, List<Integer> resultStatus, String sort, Integer page, Integer size) {
        try {
                Pageable pageable;
                if (sort != null) {
                    pageable = PageRequest.of(page, size, parseSortString(sort));
                } else {
                    pageable = PageRequest.of(page, size);
                }

                Page<TestCase> testCases = testCaseRepository.getAllByFolderId(folderId, searchString, createdBys, labelIds, resultStatus, pageable);
                List<TestCaseDTO> testCaseDTOS = testCases.stream().map((element) -> modelMapper.map(element, TestCaseDTO.class)).collect(Collectors.toList());

                for (TestCaseDTO dto : testCaseDTOS) {
                    dto.setFolderId(folderId);
                }

                PageInfo pageInfo = new PageInfo(testCases.getTotalPages(), (int) testCases.getTotalElements(), testCases.getNumber(), testCases.getSize());

                return new TestCasePage(testCaseDTOS, pageInfo);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to get all test case by folderId: ", folderId);
        }
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
}
