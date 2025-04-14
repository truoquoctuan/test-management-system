package com.tms_run.controller;

import com.tms_run.dto.FolderPage;
import com.tms_run.entity.Folder;
import com.tms_run.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
public class FolderController {

    private final FolderService folderService;

    @Autowired
    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    /**
     * Get all parent folders running (which upper_id = 0 and status = 2)
     *
     */
    @QueryMapping
    public FolderPage getAllFoldersRunningByTesPlanId(@Argument Long testPlanId, @Argument String searchString, @Argument String sort, @Argument int page, @Argument int size){
        return folderService.getAllFoldersRunningByTesPlanId(testPlanId, searchString, sort, page, size);
    }

    /**
     * Get all child/sub child folders
     *
     */
    @QueryMapping
    public List<Folder> getAllChildFoldersByUpperId(@Argument List<Integer> upperIds) {
        return folderService.getAllChildFoldersByUpperId(upperIds);
    }
}
