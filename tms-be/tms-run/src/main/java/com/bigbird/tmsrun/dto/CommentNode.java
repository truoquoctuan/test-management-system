package com.tms_run.dto;

import com.tms_run.cmmn.base.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentNode {
    private List<CommentNode> replies = new ArrayList<>();
    private CommentDTO commentDTO;
    private PageInfo pageInfo;

    public CommentNode(CommentDTO commentDTO) {
        this.commentDTO = commentDTO;
    }
    public void addReply(CommentNode reply) {
        this.replies.add(reply);
    }
}
