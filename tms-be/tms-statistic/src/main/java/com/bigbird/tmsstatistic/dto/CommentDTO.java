package com.tms_statistic.dto;

import com.tms_statistic.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    private Long commentId;

    private Long testCaseId;

    private String content;

    private String userId;

    private Users creator;

    private String userListId;

    private String createdAt;

    private String updatedAt;

}
