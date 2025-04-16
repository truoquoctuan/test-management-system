package com.tms_statistic.dto;

import com.tms_statistic.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestResultDTO {
    private Long testResultId;

    private String content;

    private Integer status;

    private String userId;

    private Users creator;

    private String assignId;

    private List<Users> assignUsers;

    private Long testCaseId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String uploadKey;

    private String fileSeqs;

}
