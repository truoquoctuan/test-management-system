package com.bigbird.tmsrepo.dto;

import com.bigbird.tmsrepo.entity.Users;
import graphql.relay.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPage {
    private List<Users> users;
    private PageInfo pageInfo;
}
