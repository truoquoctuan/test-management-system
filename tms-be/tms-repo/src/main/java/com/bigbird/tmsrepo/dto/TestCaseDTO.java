package com.bigbird.tmsrepo.dto;

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

    private String description;

    private String expectResult;

    private Integer priority;

    private Integer status;

    private String testCaseName;

    private String createdBy;

    private Long folderId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String userName;

    private String fullName;

    private List<TestCaseLabelDTO> labels;

    private List<LabelDTO> labelsInfo;

    private List<AttachFileDTO> files;

    private String fileSeqs;
}
