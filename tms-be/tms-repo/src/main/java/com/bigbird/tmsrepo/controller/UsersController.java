package com.bigbird.tmsrepo.controller;

import com.bigbird.tmsrepo.dto.TestPlanDTO;
import com.bigbird.tmsrepo.entity.Users;
import com.bigbird.tmsrepo.service.UsersService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@Slf4j
public class UsersController {

    private final UsersService usersService;

    @Autowired
    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @SchemaMapping(typeName = "Query", field = "getAllUserFromBZW")
    public List<Users> getAllUserFromBZW(@Argument String userId, @Argument String name) {
        log.info("Get user from bzw");
        return usersService.getAllUser(userId, name);
    }

    @SchemaMapping
    public Users userInfo(TestPlanDTO testPlan) {
        return usersService.findUserById(testPlan.getCreatedBy());
    }
}
