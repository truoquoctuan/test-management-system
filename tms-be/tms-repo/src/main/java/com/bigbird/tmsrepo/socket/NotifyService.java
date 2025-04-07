package com.bigbird.tmsrepo.socket;

import com.bigbird.tmsrepo.dto.NotifyDTO;
import com.bigbird.tmsrepo.dto.NotifyPage;

public interface NotifyService {

    void deleteAllPer30Days();

    NotifyPage findAll(String userId, Integer page, Integer size);

    NotifyDTO save(Notify notify);

    NotifyDTO findById(Long notifyId);

    void markAllRead(String userId);

    void markAsRead(Long notifyId, Boolean status);

    void disableNotify(Long notifyId, Boolean disable);

    void disableAllNotify(String userId);

    Integer countNotifyByUserId(String userId);

    void checkAllNotifyByUserId(String userId);

}
