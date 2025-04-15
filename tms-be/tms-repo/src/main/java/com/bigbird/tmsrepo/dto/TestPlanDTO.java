package com.bigbird.tmsrepo.dto;

import com.bigbird.tmsrepo.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestPlanDTO implements Serializable {


    private Long testPlanId;

    private String testPlanName;

    private String description;

    private Integer status;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String createdBy;

    private Boolean isPin;

    protected LocalDateTime createdAt;

    protected LocalDateTime updatedAt;

    private List<MemberDTO> members = new ArrayList<>();

    private Users userInfo;

    private String uploadKey;

    public TestPlanDTO(Long testPlanId, String testPlanName, String description, Integer status, LocalDateTime startDate, LocalDateTime endDate, String createdBy, Boolean isPin, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.testPlanId = testPlanId;
        this.testPlanName = testPlanName;
        this.description = description;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.isPin = isPin;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
    }
}
