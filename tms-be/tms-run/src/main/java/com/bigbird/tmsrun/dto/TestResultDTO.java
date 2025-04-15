package com.tms_run.dto;

import com.tms_run.entity.Users;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TestResultDTO {

    private Long testResultId;

    private String content;

    private Integer status;

    private String userId;

    private String createFullName;

    private String createUserName;

    private String assignIds;

    private String assignFullName;

    private String assignUserName;

    private List<Users> users;

    private Long testCaseId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<AttachFileDTO> files;

    private String uploadKey;

    private String fileSeqs;
}
