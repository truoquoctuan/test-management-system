package com.bigbird.tmsrepo.service.Impl;

import com.bigbird.tmsrepo.cmmn.base.BaseCrudService;
import com.bigbird.tmsrepo.cmmn.base.PageInfo;
import com.bigbird.tmsrepo.cmmn.exception.ResourceNotFoundException;
import com.bigbird.tmsrepo.dto.*;
import com.bigbird.tmsrepo.entity.Folder;
import com.bigbird.tmsrepo.entity.TestPlan;
import com.bigbird.tmsrepo.entity.Users;
import com.bigbird.tmsrepo.repository.FolderRepository;
import com.bigbird.tmsrepo.repository.TestCaseRepository;
import com.bigbird.tmsrepo.repository.TestPlanRepository;
import com.bigbird.tmsrepo.service.FolderService;
import com.bigbird.tmsrepo.service.UsersService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FolderServiceImpl extends BaseCrudService<Folder, Long> implements FolderService {

    private final FolderRepository folderRepository;

    private final TestPlanRepository testPlanRepository;

    private final TestCaseRepository testCaseRepository;

    private final UsersService usersService;

    private final ModelMapper modelMapper;

    @Autowired
    public FolderServiceImpl(FolderRepository folderRepository, TestPlanRepository testPlanRepository, TestCaseRepository testCaseRepository, UsersService usersService, ModelMapper modelMapper) {
        this.folderRepository = folderRepository;
        this.testPlanRepository = testPlanRepository;
        this.testCaseRepository = testCaseRepository;
        this.usersService = usersService;
        this.modelMapper = modelMapper;
    }

    @Override
    public Optional<FolderDTO> getFolderById(Long id) {

        if (!folderRepository.existsById(id)) {
            return Optional.empty();
        }

        Folder folder = folderRepository.getFolderById(id).get();
        FolderDTO folderDTO = modelMapper.map(folder, FolderDTO.class);

        Users user = usersService.findUserDisabledById(folder.getCreatedBy());
        folderDTO.setFullName(user.getFullName());
        folderDTO.setUserName(user.getUserName());

        return Optional.of(folderDTO);
    }

    @Override
    public FolderPage getAllFoldersByTesPlanId(Long testPlanId, String searchString, String sort, int page, int size) {

        Pageable pageable;
        if (sort != null) {
            pageable = PageRequest.of(page, size, parseSortString(sort));
        } else {
            pageable = PageRequest.of(page, size);
        }
        if (searchString != null) searchString = searchString.trim();

        Page<Folder> folderPage = folderRepository.getAllFoldersByTesPlanId(testPlanId, searchString, pageable);
        List<FolderDTO> folderDTOList = new ArrayList<>();
        for (Folder folder : folderPage) {
            FolderDTO folderDTO = modelMapper.map(folder, FolderDTO.class);
            folderDTO.setTestPlanId(testPlanId);
            folderDTO.setHasTestCase(testPlanRepository.checkFolderHasTestCase(folder.getFolderId()) > 0);
            folderDTOList.add(folderDTO);
        }

        PageInfo pageInfo = new PageInfo(folderPage.getTotalPages(), (int) folderPage.getTotalElements(), folderPage.getNumber(), folderPage.getSize());

        return new FolderPage(folderDTOList, pageInfo);
    }

    @Override
    public List<FolderDTO> getAllChildFoldersByUpperId(List<Long> upperIds) {
        if (upperIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Folder> folderList = folderRepository.getAllChildFoldersByUpperId(upperIds);
        List<FolderDTO> folderDTOList = new ArrayList<>();

        for (Folder folder : folderList) {
            FolderDTO folderDTO = modelMapper.map(folder, FolderDTO.class);
            folderDTO.setTestPlanId(folder.getTestPlan().getTestPlanId());
            folderDTO.setHasTestCase(testPlanRepository.checkFolderHasTestCase(folder.getFolderId()) > 0);
            folderDTOList.add(folderDTO);
        }

        return folderDTOList;
    }

    @Override
    public UserPage getAllMemberCreatedTestCase(Long folderId, String name, Integer page, Integer size) {
        try {
            if (folderRepository.existsById(folderId)) {
                if (name != null && !name.isEmpty()) {
                    List<Users> users = usersService.getAllUser("", name);
                    if (!users.isEmpty()) {
                        List<Users> rs = users.stream().map(x -> {
                            if (folderRepository.isExistsCreatorInFolder(folderId, x.getUserID()) == 1) {
                                return x;
                            }
                            return null;
                        }).filter(Objects::nonNull).collect(Collectors.toList());
                        return new UserPage(rs, new PageInfo());
                    }
                    return null;
                }
                Pageable pageable = PageRequest.of(page, size);
                Page<String> ids = folderRepository.getMemberCreatedTestCaseInFolder(folderId, pageable);
                List<Users> users = ids.stream().map(usersService::findUserById).filter(Objects::nonNull).collect(Collectors.toList());
                PageInfo pageInfo = new PageInfo(ids.getTotalPages(), (int) ids.getTotalElements(), ids.getNumber(), ids.getSize());
                return new UserPage(users, pageInfo);
            } else {
                throw new ResourceNotFoundException("Fail", "Folder not found: ", folderId);
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to get member in folder: ", folderId);
        }
    }

    @Override
    public FolderDTO createFolder(FolderDTO folderDTO) {
        try {
            if (folderDTO.getUpperId() != null && folderDTO.getUpperId() > 0) {
                Long totalTestCaseInFolder = testCaseRepository.countTestCaseByFolderId(folderDTO.getUpperId());
                if (totalTestCaseInFolder > 0) {
                    throw new ResourceNotFoundException("", "Fail to create folder", folderDTO);
                }
            }
            Folder folder = modelMapper.map(folderDTO, Folder.class);

            folder.setStatus(1);
            folder.setTestPlan(testPlanRepository.getTestPlansByTestPlanId(folderDTO.getTestPlanId()));

            Integer maxSortOrder = folderRepository.getMaxSortOrderByUpperId(folderDTO.getUpperId());
            if (maxSortOrder == null) {
                folder.setSortOrder(1);
            } else {
                folder.setSortOrder(maxSortOrder + 1);
            }

            folderRepository.save(folder);

            updateTestPlanUpdateTime(folderDTO.getTestPlanId());

            return modelMapper.map(folder, FolderDTO.class);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to create folder", folderDTO);
        }
    }

    @Override
    public UpdateFolderDTO updateFolderById(UpdateFolderDTO folderDTO) {
        try {
            if (!folderRepository.existsById(folderDTO.getFolderId())) {
                throw new ResourceNotFoundException("Folder", "ID", folderDTO.getFolderId());
            }

            Folder folder = folderRepository.findById(folderDTO.getFolderId()).get();

            if (folderDTO.getFolderName() != null) {
                folder.setFolderName(folderDTO.getFolderName());
            }
            if (folderDTO.getDescription() != null) {
                folder.setDescription(folderDTO.getDescription());
            }
            folder.setUpdatedAt(LocalDateTime.now());
            folderRepository.save(folder);

            updateTestPlanUpdateTime(folder.getTestPlan().getTestPlanId());

            return modelMapper.map(folder, UpdateFolderDTO.class);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to update folder", folderDTO);
        }
    }

    @Override
    public StatusDTO deleteFolderById(Long id) {
        try {
            Optional<Folder> folder = folderRepository.findById(id);
            if (folder.isPresent()) {
                folderRepository.deleteById(id);
                deleteSubFolders(id);

                updateTestPlanUpdateTime(folder.get().getTestPlan().getTestPlanId());

                return new StatusDTO(true, "Folder deleted successfully");
            } else {
                return new StatusDTO(false, "Folder not found");
            }
        } catch (Exception e) {
            return new StatusDTO(false, "Failed to delete folder: " + e.getMessage());
        }
    }

    @Override
    public StatusDTO runFolderById(List<Long> ids, Integer status) {
        try {
            if (ids.isEmpty()) {
                return new StatusDTO(false, "List id is empty");
            }
            for (Long folderId : ids) {
                Optional<Folder> folder = folderRepository.findById(folderId);
                if (folder.isPresent()) {
                    folder.ifPresent(f -> {
                        f.setStatus(status);
                        folderRepository.save(f);
                    });
                }
            }
            updateTestPlanUpdateTime(folderRepository.getFolderByFolderId(ids.get(0)).getTestPlan().getTestPlanId());

            return new StatusDTO(true, "Folder run/stop run successfully");
        } catch (Exception e) {
            return new StatusDTO(false, "Failed to run/stop run folder: " + e.getMessage());
        }
    }

    private void deleteSubFolders(Long parentFolderId) {
        List<Long> subFolderIds = folderRepository.getFolderIdByUpperId(parentFolderId);
        if (subFolderIds != null && !subFolderIds.isEmpty()) {
            for (Long subFolderId : subFolderIds) {
                deleteSubFolders(subFolderId);
                folderRepository.deleteById(subFolderId);
            }
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
            direction = "ASC";  // Default to ascending if direction is not recognized
        }

        return Sort.by(Sort.Direction.valueOf(direction), fieldName);
    }

    private void updateTestPlanUpdateTime(Long testPlanId) {
        TestPlan testPlan = testPlanRepository.getTestPlanById(testPlanId);
        testPlan.setUpdatedAt(LocalDateTime.now());
        testPlanRepository.save(testPlan);
    }
}
