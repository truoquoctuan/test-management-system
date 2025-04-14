package com.tms_run.entity;

import com.tms_run.cmmn.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "comment")
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id", nullable = false)
    private Long commentId;

    @Column(name = "comment_upper_id")
    private Long commentUpperId;

    /**
     * 1: test case
     * 2: issues
     */
    @Column(name = "comment_type")
    private Byte commentType;

    @Column(name = "comment_entity_id")
    private Long commentEntityId;

    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_list_id", columnDefinition = "LONGTEXT")
    private String userListId;

    @Override
    public Long getSeq() {
        return this.commentId;
    }
}