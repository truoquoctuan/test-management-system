package com.tms_statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseCommentDTO {
    private Long id;
    private List<CommentDTO> data;
}
