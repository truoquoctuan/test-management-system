package com.bzcom.bzc_be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequest {

    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private Map<String, List<String>> attributes;

    public void setAttributes(String key, String value) {
        attributes.put(key, value != null ? Collections.singletonList(value) : Collections.emptyList());
    }
}
