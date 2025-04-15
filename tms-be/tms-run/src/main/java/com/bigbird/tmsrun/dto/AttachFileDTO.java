package com.tms_run.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttachFileDTO {

    private Long fileSeq;

    private String fileName;

    private Long fileSize;

    private String groupId;

    private LocalDateTime saveDt;

    private String saveNm;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
