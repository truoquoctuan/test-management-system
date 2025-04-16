package com.tms_statistic.service;

import com.tms_statistic.dto.CommentDTO;

import java.util.List;

public interface CommentService {
    List<CommentDTO> getAllCommentByTestCaseId(Long testCaseId);
}
