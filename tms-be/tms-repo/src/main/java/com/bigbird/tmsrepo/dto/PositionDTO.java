package com.bigbird.tmsrepo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PositionDTO {
    private Long positionId;

    private String positionName;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
