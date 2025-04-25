package com.bzcom.bzc_be.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "USER_ACTIVITY")
@Data
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ACTIVITY_ID")
    public Long userActivityId;

    @Column(name = "USER_ID")
    public String userId;

    @Column(name = "AUTHOR_ID")
    public String authorId;

    @Column(name = "ACTIVITY_DATE_TIME")
    public LocalDateTime activityDateTime;

    @Column(name = "CONTENT")
    public String content;
}
