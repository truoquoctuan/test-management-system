package com.tms_run.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TestCaseDTO {

    private Long testCaseId;

    private Integer priority;

    private Integer status;

    private String testCaseName;

    private String createdBy;

    private Long folderId;

    private Integer resultStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<LabelDTO> labelsInfo;
}
