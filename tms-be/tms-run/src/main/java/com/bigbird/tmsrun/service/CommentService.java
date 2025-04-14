package com.tms_run.service;

import com.tms_run.dto.CommentDTO;
import com.tms_run.dto.CommentNode;
import com.tms_run.dto.CommentPage;

public interface CommentService {

    CommentDTO createComment(CommentDTO input);

    CommentDTO updateComment(CommentDTO input);

    CommentPage getAllComment(Long commentEntityId, Byte type, Integer page, Integer size);

    CommentNode getCommentTree(Long parentId,Byte commentType, Integer page, Integer size);

    void deleteAllCommentsByEntityIdAndType(Long entityId, Integer type);
}
