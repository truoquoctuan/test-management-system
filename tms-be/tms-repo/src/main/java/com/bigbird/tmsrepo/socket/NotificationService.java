package com.bigbird.tmsrepo.socket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendPrivateNotification(String userId, String content) {
        ResponseNotify message = new ResponseNotify(content);
        messagingTemplate.convertAndSendToUser(userId, "/topic/private-notifications", message);
    }
}
