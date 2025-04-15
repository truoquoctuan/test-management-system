package com.tms_run.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssuesModifyDTO {
    @NotNull
    private Long issuesId;
    @NotNull
    @Size(max = 255, message = "Maximum length is 255 characters")
    private String issuesName;
    private Integer status;
    @Size(max = 255, message = "Maximum length is 255 characters")
    private String scope;
    @Size(max = 10000, message = "Maximum length is 10000 characters")
    private String description;
    @Size(max = 255, message = "Maximum length is 255 characters")
    private String note;
    private String uploadKey;
}
