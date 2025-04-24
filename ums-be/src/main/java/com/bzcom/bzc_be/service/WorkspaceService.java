package com.bzcom.bzc_be.service;

import com.bzcom.bzc_be.dto.request.AddMemberRequest;
import com.bzcom.bzc_be.dto.request.RemoveMemberRequest;
import com.bzcom.bzc_be.entity.Workspace;
import org.springframework.http.ResponseEntity;

public interface WorkspaceService {
    ResponseEntity<?> getWorkspaceByName(String name);

    ResponseEntity<?> addMembers(AddMemberRequest addMemberRequest);

    ResponseEntity<?> removeMember(RemoveMemberRequest removeMemberRequest);
}
