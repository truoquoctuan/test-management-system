package com.tms_run.repository;

import com.tms_run.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query(value = "select c from Comment c where c.commentEntityId = ?1 and c.commentType = ?2 and c.commentUpperId = 0 " +
            "order by c.commentId desc")
    Page<Comment> getAllComment(Long commentEntityId, Byte type, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.commentUpperId = :parentId and c.commentType = :commentType order by c.commentId asc ")
    Page<Comment> findRepliesByParentId(Long parentId, Byte commentType, Pageable pageable);

    @Query("SELECT COUNT(DISTINCT c2.commentId) FROM Comment c1 " +
            "INNER JOIN Comment c2 ON c2.commentUpperId = c1.commentId " +
            "WHERE c2.commentUpperId = :parentId")
    Integer getTotalReplies(Long parentId);

    @Query("select distinct c.userId from Comment c where c.commentUpperId = :parentId")
    List<String> getUserRepliedList(Long parentId);

    @Query(nativeQuery = true, value = "delete from comment where comment_entity_id = ?1 and comment_type = ?2")
    void removeCommentsByEntityIdAndType(Long entityId, Integer type);

    @Query(value = "select c from Comment c where c.commentId = :commentId")
    Comment getCommentByCommentId(Long commentId);
}
