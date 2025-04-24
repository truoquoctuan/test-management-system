package com.bzcom.bzc_be.service;

import com.bzcom.bzc_be.cmmn.base.PageParam;
import com.bzcom.bzc_be.dto.UserActivityDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface UserActivityService {

    ResponseEntity<?> getUserActivities(String userId, Pageable pageable);

    ResponseEntity<?> addUserActivity(UserActivityDTO userActivityDTO);
}
