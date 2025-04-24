package com.bzcom.bzc_be.service;

import com.bzcom.bzc_be.dto.UserDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface UserService {

    ResponseEntity<?> getUsers(String groupId, String userName, int enabled, Pageable pageable);

    ResponseEntity<?> getUsersNotInGroup(String groupId, String searchName, Pageable pageable);

    ResponseEntity<?> updateUser(UserDTO userDTO);

    ResponseEntity<?> updateStatus(String userId, int status);

    ResponseEntity<?> getUserById(String userId);

    ResponseEntity<?> getUserPublicInfoById(String userId);
}
