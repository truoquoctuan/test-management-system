package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LabelDTO {

    private Long labelId;

    private String labelName;

    private String labelColor;

    private Integer labelType;

    private Long testPlanId;

    private Long testCaseId;
}
