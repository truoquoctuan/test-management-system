package com.bigbird.tmsrepo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class FolderDTO implements Serializable {

    private Long folderId;

    private String folderName;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Integer sortOrder;

    private Long upperId;

    private String createdBy;

    private Integer status;

    private String userName;

    private String fullName;

    private Long testPlanId;

    private Boolean hasTestCase;
}
