package com.bigbird.tmsrepo.service;

import com.bigbird.tmsrepo.dto.*;

import java.util.List;
import java.util.Optional;

public interface FolderService {

    Optional<FolderDTO> getFolderById(Long id);

    FolderPage getAllFoldersByTesPlanId(Long testPlanId, String searchString, String sort, int page, int size);

    UpdateFolderDTO updateFolderById(UpdateFolderDTO folderDTO);

    StatusDTO deleteFolderById(Long id);

    StatusDTO runFolderById(List<Long> ids, Integer status);

    FolderDTO createFolder(FolderDTO input);

    List<FolderDTO> getAllChildFoldersByUpperId(List<Long> upperIds);

    UserPage getAllMemberCreatedTestCase(Long folderId, String name, Integer page, Integer size);
}
