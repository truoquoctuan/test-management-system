package com.bigbird.tmsrepo.socket;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WSService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    public WSService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
}

/*
SimpMessagingTemplate là một Spring class được sử dụng để gửi thông báo đến các khách hàng thông qua WebSocket.
*/
