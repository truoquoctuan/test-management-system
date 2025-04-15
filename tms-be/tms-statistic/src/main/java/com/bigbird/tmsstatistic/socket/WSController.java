package com.tms_statistic.socket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WSController {

    private final WSService service;

    @Autowired
    public WSController(WSService service) {
        this.service = service;
    }

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public String greeting(String message) {
        // This method will be invoked when a message is sent to "/app/hello"
        return "Hello, " + message + "!";
    }
}

