package com.tms_run.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;

@Data
@Entity
@Table(name = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "add_by")
    private String addBy;

    /**
     * 1: owner
     * 2: editor
     * 3: viewer
     */
    @Column(name = "role_test_plan", nullable = false)
    private Integer roleTestPlan;

    @CreationTimestamp
    @Column(name = "added_at", updatable = false)
    private LocalDateTime addedAt;

    @ManyToOne
    @JoinColumn(name = "test_plan_id")
    private TestPlan testPlan;

//    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
//    private List<MemberPosition> memberPositions = new ArrayList<>();

    @PostPersist
    public void setDefaultValue() {
        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
        addedAt = LocalDateTime.now(zone);
    }

}