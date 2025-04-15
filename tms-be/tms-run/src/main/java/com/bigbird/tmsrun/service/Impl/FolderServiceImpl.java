package com.tms_run.service.Impl;

import com.tms_run.cmmn.base.BaseCrudService;
import com.tms_run.cmmn.base.PageInfo;
import com.tms_run.dto.FolderPage;
import com.tms_run.entity.Folder;
import com.tms_run.repository.FolderRepository;
import com.tms_run.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderServiceImpl extends BaseCrudService<Folder, Long> implements FolderService {

    private final FolderRepository folderRepository;

    @Override
    public FolderPage getAllFoldersRunningByTesPlanId(Long testPlanId, String searchString, String sort, int page, int size){
            Pageable pageable;
            if (sort != null) {
                pageable = PageRequest.of(page, size, parseSortString(sort));
            } else {
                pageable = PageRequest.of(page, size);
            }

            Page<Folder> folderPage = folderRepository.getAllFoldersRunningByTesPlanId(testPlanId, searchString, pageable);

            PageInfo pageInfo = new PageInfo(
                    folderPage.getTotalPages(),
                    (int) folderPage.getTotalElements(),
                    folderPage.getNumber(),
                    folderPage.getSize()
            );

            return new FolderPage(folderPage.getContent(), pageInfo);
    }

    @Override
    public List<Folder> getAllChildFoldersByUpperId(List<Integer> upperIds) {
        if (upperIds.isEmpty()) {
            return Collections.emptyList();
        }
        return folderRepository.getAllChildFoldersByUpperId(upperIds);
    }

    private Sort parseSortString(String sort) {
        if (sort == null || sort.isEmpty()) {
            return Sort.unsorted();
        }
        String[] sortParams = sort.split("\\+");
        String fieldName = sortParams[0];
        String direction = sortParams.length > 1 ? sortParams[1].toUpperCase() : "ASC";

        if (!direction.equals("ASC") && !direction.equals("DESC")) {
            direction = "ASC";  // Default to ascending if direction is not recognized
        }

        return Sort.by(Sort.Direction.valueOf(direction), fieldName);
    }
}
