package com.bigbird.tmsrepo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotifyDTO {
    private Long notifyId;

    private String notifyContent;

    private Boolean status;

    private Boolean disable;

    private String link;

    private String senderId;

    private String userId;

    private LocalDateTime createdAt;
}
