package com.bzcom.bzc_be.service.impl;

import com.bzcom.bzc_be.cmmn.base.Response;
import com.bzcom.bzc_be.dto.request.AddMemberRequest;
import com.bzcom.bzc_be.dto.request.RemoveMemberRequest;
import com.bzcom.bzc_be.entity.UserGroupMembership;
import com.bzcom.bzc_be.entity.Workspace;
import com.bzcom.bzc_be.repository.UserGroupMembershipRepository;
import com.bzcom.bzc_be.repository.WorkspaceRepository;
import com.bzcom.bzc_be.service.WorkspaceService;
import org.keycloak.authorization.client.util.Http;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WorkspaceServiceImpl implements WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserGroupMembershipRepository userGroupMembershipRepository;

    @Override
    public ResponseEntity<?> getWorkspaceByName(String name) {
        Optional<Workspace> workspace = Optional.ofNullable(workspaceRepository.findWorkspaceByName(name));
        return ResponseEntity.status(HttpStatus.OK).body(new Response().setData( workspace.get()).setMessage("Successfully!"));
    }

    @Override
    public ResponseEntity<?> addMembers(AddMemberRequest addMemberRequest) {
        try {
            List<UserGroupMembership> userGroupMemberships = new ArrayList<>();

            for (String userId : addMemberRequest.getUserIdArr()) {
                UserGroupMembership userGroupMembership = new UserGroupMembership();
                userGroupMembership.setGroupId(addMemberRequest.getGroupId());
                userGroupMembership.setUserId(userId);
                userGroupMembership.setMembershipType("UNMANAGED");

                userGroupMemberships.add(userGroupMembership);
            }

            userGroupMembershipRepository.saveAll(userGroupMemberships);
            return ResponseEntity.status(HttpStatus.OK).body("Add members successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }

    @Override
    public ResponseEntity<?> removeMember(RemoveMemberRequest removeMemberRequest) {
        try {
            UserGroupMembership userGroupMembership = userGroupMembershipRepository.findUserGroupMembershipByGroupIdAndUserId(removeMemberRequest.getGroupId(), removeMemberRequest.getUserId());

            if (userGroupMembership != null) {
                userGroupMembershipRepository.delete(userGroupMembership);
                return ResponseEntity.status(HttpStatus.OK).body("Remove member workspace successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Can't found user group membership by groupId: " + removeMemberRequest.getGroupId() +
                                " and userId: " + removeMemberRequest.getUserId());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error!");
        }
    }
}
