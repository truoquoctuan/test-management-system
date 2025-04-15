package com.tms_run.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LabelDTO {

    private Long labelId;

    private String labelName;

    private String labelColor;

    private Long testPlanId;

    private Long testCaseId;

    private Integer labelType;
}