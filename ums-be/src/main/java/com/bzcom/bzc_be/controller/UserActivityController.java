package com.bzcom.bzc_be.controller;

import com.bzcom.bzc_be.cmmn.base.PageParam;
import com.bzcom.bzc_be.dto.UserActivityDTO;
import com.bzcom.bzc_be.service.UserActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-activity")
public class UserActivityController {

    @Autowired
    private UserActivityService userActivityService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserActivities(@PathVariable String userId, PageParam pageParam) {
        return userActivityService.getUserActivities(userId, pageParam.of());
    }

    @PostMapping("/add-activity")
    public ResponseEntity<?> addActivity(@RequestBody UserActivityDTO userActivityDTO) {
        return userActivityService.addUserActivity(userActivityDTO);
    }
}
