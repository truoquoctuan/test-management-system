package com.tms_statistic.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "label")
public class Label {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "label_id")
    private Long labelId;

    @Column(name = "label_name", nullable = false)
    private String labelName;

    @Column(name = "label_color", nullable = false)
    private String labelColor;

    @ManyToOne
    @JoinColumn(name = "test_plan_id")
    private TestPlan testPlan;

    @OneToMany(mappedBy = "label", cascade = CascadeType.ALL)
    private List<LabelEntity> labelEntities = new ArrayList<>();

}
