package com.bigbird.tmsrepo.dto;

import com.bigbird.tmsrepo.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberDTO {
    private Long memberId;

    private String userId;

    private String addBy;

    private Integer roleTestPlan;

    private LocalDateTime addedAt;

    private List<PositionDTO> positions = new ArrayList<>();

    private Users userInfo;

    private Users adderInfo;
}
