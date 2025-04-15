package com.tms_run.dto;

import com.tms_run.entity.Users;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {

    private Long commentId;

    private Long testCaseId;

    private String content;

    private String userId;

    private Users users;

    private String userListId;

    private List<Users> userListIdInfo;

    private Long commentEntityId;

    private Integer commentType;

    private Long commentUpperId;

    private Integer totalReplies;

    private String createdAt;

    private String updatedAt;

    private List<Users> userRepliedList;
}
