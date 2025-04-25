package com.bzcom.bzc_be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "USER_ENTITY")
@Data
public class User {

    @Id
    @Column(name = "ID")
    public String userId;

    @Column(name = "EMAIL")
    public String email;

    @Column(name = "EMAIL_CONSTRAINT")
    public String emailConstraint;

    @Column(name = "EMAIL_VERIFIED")
    public String emailVerified;

    @Column(name = "ENABLED")
    public int enabled;

    @Column(name = "FEDERATION_LINK")
    public String federationLink;

    @Column(name = "FIRST_NAME")
    public String firstName;

    @Column(name = "LAST_NAME")
    public String lastName;

    @Column(name = "REALM_ID")
    public String realmId;

    @Column(name = "USERNAME")
    public String userName;

    @Column(name = "CREATED_TIMESTAMP")
    public Long createdTimestamp;

    @Column(name = "SERVICE_ACCOUNT_CLIENT_LINK")
    public String serviceAccountClientLink;

    @Column(name = "NOT_BEFORE")
    public int notBefore;
}
