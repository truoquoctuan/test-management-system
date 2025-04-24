package com.bzcom.bzc_be.dto.request;

import lombok.Data;

@Data
public class AddMemberRequest {

    public String groupId;

    public String[] userIdArr;
}
