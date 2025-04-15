package com.bigbird.tmsrepo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "member_position")
public class MemberPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_position_id")
    private Long memberPositionId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;
}
