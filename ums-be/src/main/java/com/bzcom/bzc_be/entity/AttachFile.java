package com.bzcom.bzc_be.entity;

import com.bzcom.bzc_be.cmmn.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "FILE")
@Data
public class AttachFile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long fileSeq;

    public String groupId;

    public String fileNm;

    public String saveNm;

    private Long fileSize;

    @CreationTimestamp
    private LocalDateTime saveDt;

    @Override
    public Long getSeq() {
        return this.fileSeq;
    }
}
