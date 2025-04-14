package com.tms_run.entity;

import com.tms_run.cmmn.base.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Users extends BaseEntity {

    private String userID;

    private String userName;

    private String fullName;

    private String email;

    public Users() {

    }

    @Override
    public Long getSeq() {
        return null;
    }
}

