package com.tms_run.service;

import com.tms_run.dto.FolderDTO;
import com.tms_run.dto.FolderPage;
import com.tms_run.entity.Folder;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface FolderService {

    FolderPage getAllFoldersRunningByTesPlanId(Long testPlanId, String searchString, String sort, int page, int size) ;

    List<Folder> getAllChildFoldersByUpperId(List<Integer> upperIds);
}
