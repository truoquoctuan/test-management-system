package com.tms_run.socket;

import com.tms_run.cmmn.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "notify")
public class Notify extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notify_id")
    private Long notifyId;

    @Column(name = "notify_content")
    private String notifyContent;

    /**
     * status = T : Đã đọc.
     * status = F : Chưa đọc.
     */
    @Column(name = "status")
    private Boolean status;

    /**
     * disable = T : gỡ thông báo
     * disable = F : chưa gỡ thông báo
     */
    @Column(name = "disable")
    private Boolean disable;

    /**
     * checked = T : đã check
     * checked = F : chưa check thông báo
     * - trường này nhằm mục đích count notify
     */
    @Column(name = "checked")
    private Boolean checked;

    @Column(name = "link")
    private String link;

    @Column(name = "sender_id")
    private String senderId;

    @Column(name = "user_id")
    private String userId;

    @Override
    public Long getSeq() {
        return this.notifyId;
    }

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = false;
        }
        if (disable == null) {
            disable = false;
        }
        if (checked == null) {
            checked = false;
        }
    }
}
