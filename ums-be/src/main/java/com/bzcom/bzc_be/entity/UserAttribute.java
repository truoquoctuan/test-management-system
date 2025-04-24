package com.bzcom.bzc_be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "USER_ATTRIBUTE")
@Data
public class UserAttribute {

    @Id
    @Column(name = "ID")
    public String userAttributeId;

    @Column(name = "USER_ID")
    public String userId;

    @Column(name = "NAME")
    public String name;

    @Column(name = "VALUE")
    public String value;

    @Column(name = "LONG_VALUE_HASH")
    public UUID longValueHash;

    @Column(name = "LONG_VALUE_HASH_LOWER_CASE")
    public UUID longValueHashLowerCase;

    @Column(name = "LONG_VALUE")
    public String longValue;
}
