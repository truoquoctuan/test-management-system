package com.tms_file.cmmn.base;

import com.tms_file.cmmn.util.TimeZoneUtils;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Transient;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    protected static final long serialVersionUID = 1L;

    public abstract Long getSeq();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    protected LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    protected LocalDateTime updatedAt;

    @Transient
    protected String uploadKey;

    @Transient
    private String searchCreatedAt;

    @Transient
    private String searchUpdatedAt;


    @Transient
    protected String searchDate;

    @PostPersist
    public void setDefaultValue() {
        ZoneId zone = ZoneId.of(TimeZoneUtils.timeZoneMap.get("VST"));
        LocalDateTime currentDateTime = LocalDateTime.now(zone);
        createdAt = currentDateTime;
        updatedAt = currentDateTime;
    }

}

