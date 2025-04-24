package com.bzcom.bzc_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserPublicDTO {

    public String userId;

    public String userName;

    public String firstName;

    public String lastName;

    public String email;

    public Integer enabled;
}
