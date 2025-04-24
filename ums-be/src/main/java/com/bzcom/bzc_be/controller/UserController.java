package com.bzcom.bzc_be.controller;

import com.bzcom.bzc_be.cmmn.base.PageParam;
import com.bzcom.bzc_be.dto.UserDTO;
import com.bzcom.bzc_be.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/groups/{groupId}/members")
    public ResponseEntity<?> getUsers(@PathVariable(required = true) String groupId,
                                      @RequestParam(required = false) String userName,
                                      @RequestParam(required = true) int enabled,
                                      PageParam pageParam) {
        return userService.getUsers(groupId ,userName, enabled, pageParam.of());
    }

    @GetMapping("/users-not-in-group/{groupId}")
    public ResponseEntity<?> getUsersNotInGroup(@PathVariable(required = true) String groupId,
                                    @RequestParam(required = false) String searchName,
                                    PageParam pageParam) {
        return userService.getUsersNotInGroup(groupId, searchName, pageParam.of());
    }

    @PutMapping("/update-user")
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO) {
        return userService.updateUser(userDTO);
    }

    @PutMapping("/{userId}/update-status/{status}")
    public ResponseEntity<?> updateStatus(@PathVariable String userId,
                                          @PathVariable int status) {
        return userService.updateStatus(userId, status);
    }

    @GetMapping("{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        return userService.getUserById(userId);
    }
}
