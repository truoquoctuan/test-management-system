package com.bzcom.bzc_be.controller;

import com.bzcom.bzc_be.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/user")
public class UserPublicController {

    @Autowired
    private UserService userService;

    @GetMapping("{userId}")
    public ResponseEntity<?> findUserById(@PathVariable String userId) {
        return userService.getUserPublicInfoById(userId);
    }
}
