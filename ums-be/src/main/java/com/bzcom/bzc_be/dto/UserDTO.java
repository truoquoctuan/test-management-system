package com.bzcom.bzc_be.dto;

import lombok.*;

import java.time.LocalDate;

@Data
public class UserDTO {

    public String userId;

    public String email;

    public String emailConstraint;

    public String emailVerified;

    public int enabled;

    public String federationLink;

    public String firstName;

    public String lastName;

    public String realmId;

    public String userName;

    public Long createdTimestamp;

    public String serviceAccountClientLink;

    public int notBefore;

    public String phoneNumber;

    public String address;

    public String position;

    public LocalDate birthDate;

    public String userCode;

    public String gender;

    public LocalDate startDate;

    public UserDTO(String userId, String email, String emailConstraint, String emailVerified,
                   int enabled, String federationLink, String firstName, String lastName,
                   String realmId, String userName, Long createdTimestamp,
                   String serviceAccountClientLink, int notBefore, String phoneNumber,
                   String address, String position, LocalDate birthDate, String userCode,
                   String gender, LocalDate startDate) {
        this.userId = userId;
        this.email = email;
        this.emailConstraint = emailConstraint;
        this.emailVerified = emailVerified;
        this.enabled = enabled;
        this.federationLink = federationLink;
        this.firstName = firstName;
        this.lastName = lastName;
        this.realmId = realmId;
        this.userName = userName;
        this.createdTimestamp = createdTimestamp;
        this.serviceAccountClientLink = serviceAccountClientLink;
        this.notBefore = notBefore;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.position = position;
        this.birthDate = birthDate;
        this.userCode = userCode;
        this.gender = gender;
        this.startDate = startDate;
    }
}
