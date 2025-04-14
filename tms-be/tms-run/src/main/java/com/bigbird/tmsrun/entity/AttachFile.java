package com.tms_run.entity;

import com.tms_run.cmmn.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "file")
public class AttachFile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_seq", nullable = false)
    private Long fileSeq;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "group_id")
    private String groupId;

    @Column(name = "save_dt")
    private LocalDateTime saveDt;

    @Column(name = "save_nm")
    private String saveNm;

    @Override
    public Long getSeq() {
        return this.fileSeq;
    }
}
