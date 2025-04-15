package com.tms_run.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms_run.cmmn.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Getter
@Setter
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

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "test_plan_id")
    private TestPlan testPlan;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL)
    private List<TestCase> testCases = new ArrayList<>();

    @Override
    public Long getSeq() {
        return null;
    }

}