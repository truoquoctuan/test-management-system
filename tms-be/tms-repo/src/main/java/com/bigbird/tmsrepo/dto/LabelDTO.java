package com.bigbird.tmsrepo.dto;

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

    private Integer labelType;

    private Long testPlanId;

    private Long testCaseId;
}
