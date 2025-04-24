package com.bzcom.bzc_be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "USER_GROUP_MEMBERSHIP")
@Data
public class UserGroupMembership {

    @Id
    @Column(name = "USER_ID")
    public String userId;

    @Column(name = "GROUP_ID")
    public String groupId;

    @Column(name = "MEMBERSHIP_TYPE")
    public String membershipType;
}
