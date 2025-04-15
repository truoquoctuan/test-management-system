package com.bigbird.tmsrepo.controller;

import com.bigbird.tmsrepo.dto.*;
import com.bigbird.tmsrepo.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class FolderController {

    private final FolderService folderService;

    @Autowired
    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @QueryMapping
    public Optional<FolderDTO> getFolderById(@Argument Long id) {
        return folderService.getFolderById(id);
    }

    /**
     * Get all parent folders (which upper_id = 0)
     *
     * @return
     */
    @QueryMapping
    public FolderPage getAllFoldersByTesPlanId(@Argument Long testPlanId, @Argument String searchString, @Argument String sort, @Argument int page, @Argument int size) {
        return folderService.getAllFoldersByTesPlanId(testPlanId, searchString, sort, page, size);
    }

    /**
     * Get all child/sub child folders
     *
     * @return
     */
    @QueryMapping
    public List<FolderDTO> getAllChildFoldersByUpperId(@Argument List<Long> upperIds) {
        return folderService.getAllChildFoldersByUpperId(upperIds);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateFolderById")
    public UpdateFolderDTO updateFolderById(@Argument UpdateFolderDTO input) {
        return folderService.updateFolderById(input);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteFolderById")
    public StatusDTO deleteFolderById(@Argument Long id) {
        return folderService.deleteFolderById(id);
    }

    @SchemaMapping(typeName = "Mutation", field = "runFolder")
    public StatusDTO runFolderById(@Argument List<Long> ids, @Argument Integer status) {
        return folderService.runFolderById(ids, status);
    }

    @SchemaMapping(typeName = "Mutation", field = "createFolder")
    public FolderDTO createFolder(@Argument FolderDTO input) {
        return folderService.createFolder(input);
    }

    @SchemaMapping(typeName = "Query", field = "getAllMemberCreatedTestCase")
    public UserPage getAllMemberCreatedTestCase(@Argument Long folderId, @Argument String name, @Argument Integer page, @Argument Integer size) {
        return folderService.getAllMemberCreatedTestCase(folderId, name, page, size);
    }
}
