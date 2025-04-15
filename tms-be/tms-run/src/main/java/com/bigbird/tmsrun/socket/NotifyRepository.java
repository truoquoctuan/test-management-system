package com.tms_run.socket;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotifyRepository extends JpaRepository<Notify, Long> {
    @Query(nativeQuery = true, value = "select n from notify n where n.notify_id = :notifyId")
    Notify findByNotifyId(Long notifyId);

    @Modifying
    @Transactional
    @Query("update Notify n set n.status = true where n.userId = :userId")
    void markAllRead(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("update Notify n set n.status = :status where n.notifyId = :notifyId")
    void markAsRead(@Param("notifyId") Long notifyId, @Param("status") Boolean status);

    @Query(nativeQuery = true, value = "SELECT n FROM notify n WHERE n.disable = true AND n.createdDate >= :expireDate")
    List<Notify> findRecentNotifies(@Param("expireDate") LocalDateTime expireDate);

    @Query("select n from Notify n where n.userId = :userId and n.disable = false order by n.createdAt desc ")
    Page<Notify> getAllNotifyByUserId(Long userId, Pageable pageable);

    @Modifying
    @Transactional
    @Query("update Notify n set n.disable = :disable where n.notifyId = :notifyId")
    void disableNotify(Long notifyId, Boolean disable);

    @Modifying
    @Transactional
    @Query("update Notify n set n.disable = true where n.userId = :userId")
    void disableAllNotify(Long userId);

    @Query(nativeQuery = true, value = "select count(distinct notify_id) from notify where user_id = :userId and checked = false")
    Integer countNotifyByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("update Notify n set n.checked = true where n.userId = :userId")
    void checkAllNotifyByUserId(Long userId);

}
