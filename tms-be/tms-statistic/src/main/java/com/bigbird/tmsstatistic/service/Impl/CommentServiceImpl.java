package com.tms_statistic.service.Impl;

import com.tms_statistic.dto.CommentDTO;
import com.tms_statistic.entity.Comment;
import com.tms_statistic.entity.Users;
import com.tms_statistic.repository.CommentRepository;
import com.tms_statistic.service.CommentService;
import com.tms_statistic.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final UsersService usersService;
    private final ModelMapper modelMapper;

    @Override
    public List<CommentDTO> getAllCommentByTestCaseId(Long testCaseId) {
        try {
            List<Comment> comments = commentRepository.getAllCommentByTestCaseId(testCaseId);
            return comments.stream().map(comment -> {
                CommentDTO commentDTO = modelMapper.map(comment, CommentDTO.class);
                if (comment.getUserId() != null) {
                    Users users = usersService.findUserById(comment.getUserId());
                    commentDTO.setCreator(users);
                }
                return commentDTO;
            }).toList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
