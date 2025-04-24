package com.bzcom.bzc_be.controller;

import com.bzcom.bzc_be.dto.request.AddMemberRequest;
import com.bzcom.bzc_be.dto.request.RemoveMemberRequest;
import com.bzcom.bzc_be.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workspace")
public class WorkspaceController {

    @Autowired
    private WorkspaceService workspaceService;

    @GetMapping("/getWorkspaceByName")
    public ResponseEntity<?> getWorkspaceByName(@RequestParam String name) {
        return workspaceService.getWorkspaceByName(name);
    }

    @PostMapping("/add-members")
    @PreAuthorize("hasRole('workspace_admin')")
    public ResponseEntity<?> addMembers(@RequestBody AddMemberRequest addMemberRequest) {
        return workspaceService.addMembers(addMemberRequest);
    }

    @PostMapping("/remove-member")
    @PreAuthorize("hasRole('workspace_admin')")
    public ResponseEntity<?> removeMember(@RequestBody RemoveMemberRequest removeMemberRequest) {
        return workspaceService.removeMember(removeMemberRequest);
    }
}
