package com.tms_run.controller;

import com.tms_run.dto.CommentDTO;
import com.tms_run.dto.CommentNode;
import com.tms_run.dto.CommentPage;
import com.tms_run.service.CommentService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CommentController {

    private final CommentService commentService;


    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @MessageMapping("/comment")
    @SendTo("/topic/comment")
    public void commentAdded() {
    }

    @QueryMapping
    public CommentPage getAllComment(@Argument Long commentEntityId, @Argument Byte commentType, @Argument Integer page, @Argument Integer size) {
        return commentService.getAllComment(commentEntityId, commentType, page, size);
    }

    @SchemaMapping(typeName = "Mutation", field = "createComment")
    public CommentDTO createComment(@Argument CommentDTO input) {
        return commentService.createComment(input);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateComment")
    public CommentDTO updateComment(@Argument CommentDTO input) {
        return commentService.updateComment(input);
    }

    @SchemaMapping(typeName = "Query", field = "getReplies")
    public CommentNode getReplies(@Argument Long parentId, @Argument Byte commentType, @Argument Integer page, @Argument Integer size) {
        return commentService.getCommentTree(parentId, commentType, page, size);
    }
}
