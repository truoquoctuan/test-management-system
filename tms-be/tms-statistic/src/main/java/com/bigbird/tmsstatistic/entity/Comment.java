package com.tms_statistic.entity;

import com.tms_statistic.cmmn.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private Integer commentType;

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