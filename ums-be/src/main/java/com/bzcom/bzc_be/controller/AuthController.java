package com.bzcom.bzc_be.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/valid-accessToken")
    @PreAuthorize("hasRole('bzc_user')")
    public boolean validAccessToken() {
        return true;
    }
}
