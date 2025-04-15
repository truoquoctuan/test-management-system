package com.tms_statistic.entity;

import com.tms_statistic.cmmn.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "folder")
public class Folder extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "folder_id")
    private Long folderId;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "folder_name")
    private String folderName;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "upper_id")
    private Integer upperId;

    /**
     * 1: chưa chạy
     * 2: đang chạy
     */
    @Column(name = "status", columnDefinition = "int(1) default(1)")
    private Integer status;


    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL)
    private List<TestCase> testCases = new ArrayList<>();

    @Override
    public Long getSeq() {
        return null;
    }

}
