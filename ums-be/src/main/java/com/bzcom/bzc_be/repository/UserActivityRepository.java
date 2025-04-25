package com.bzcom.bzc_be.repository;

import com.bzcom.bzc_be.dto.UserActivityDTO;
import com.bzcom.bzc_be.entity.UserActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    @Query(value = """
        SELECT new com.bzcom.bzc_be.dto.UserActivityDTO(
            ua.userActivityId,
            ua.userId,
            ua.authorId,
            ua.activityDateTime,
            ua.content,
            u.firstName,
            u.lastName,
            u.userName
        )
        FROM UserActivity ua
        LEFT JOIN User u on ua.authorId = u.userId
        WHERE ua.userId = :userId
        """, nativeQuery = false)
    Page<UserActivityDTO> getUserActivities(String userId, Pageable pageable);
}
