package com.bzcom.bzc_be.dto;

import com.bzcom.bzc_be.cmmn.util.CmdUserActivity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserActivityDTO {

    public Long userActivityId;

    public String userId;

    public String authorId;

    public LocalDateTime activityDateTime;

    public String content;

    public CmdUserActivity command;

    public String authorFirstNm;

    public String authorLastNm;

    public String authorUserNm;

    public UserActivityDTO(Long userActivityId, String userId, String authorId, LocalDateTime activityDateTime, String content, String authorFirstNm, String authorLastNm, String authorUserNm) {
        this.userActivityId = userActivityId;
        this.userId = userId;
        this.authorId = authorId;
        this.activityDateTime = activityDateTime;
        this.content = content;
        this.authorFirstNm = authorFirstNm;
        this.authorLastNm = authorLastNm;
        this.authorUserNm = authorUserNm;
    }
}
