package com.tms_statistic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@Entity
@Table(name = "assign")
public class Assign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assign_id")
    private Long assignId;

    @Column(name = "user_id")
    private String userId;

    /**
     * 1: assign result
     * 2: assign issues
     */
    @Column(name = "assign_type")
    private Integer assignType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "assign_date")
    private LocalDateTime assignDate;

    @PostPersist
    public void setDefaultValue() {
        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
        LocalDateTime CURRENT_DATE = LocalDateTime.now(zone);
        this.setAssignDate(CURRENT_DATE);
    }
}
