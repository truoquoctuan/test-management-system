package com.tms_statistic.repository;

import com.tms_statistic.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query(nativeQuery = true, value = "select cm.comment_id, cm.created_at, cm.updated_at, cm.content, cm.user_id, cm.user_list_id, cm.comment_entity_id, cm.comment_type, cm.comment_upper_id from comment cm " +
            "where cm.comment_entity_id = :testCaseId " +
            "and cm.comment_type = 1")
    List<Comment> getAllCommentByTestCaseId(Long testCaseId);

}
