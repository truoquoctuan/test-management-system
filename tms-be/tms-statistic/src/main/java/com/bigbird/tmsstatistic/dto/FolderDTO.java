package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FolderDTO {
    private Long folderId;

    private String createdBy;

    private String description;

    private String folderName;

    private Integer sortOrder;

    private Integer upperId;

    private Integer status;

    private List<TestCaseDTO> testCases;
}
