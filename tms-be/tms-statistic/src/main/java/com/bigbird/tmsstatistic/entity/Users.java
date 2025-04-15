package com.tms_statistic.entity;

import com.tms_statistic.cmmn.base.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users extends BaseEntity {
    private String userID;

    private String userName;

    private String fullName;

    @Override
    public Long getSeq() {
        return null;
    }

}
