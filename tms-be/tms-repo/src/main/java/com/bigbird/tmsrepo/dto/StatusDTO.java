package com.bigbird.tmsrepo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatusDTO {

    private Boolean isSuccess;

    private String message;
}
