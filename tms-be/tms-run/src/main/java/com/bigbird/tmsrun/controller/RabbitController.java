//package com.tms_run.controller;
//
//import com.tms_run.service.RabbitProducer;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class RabbitController {
//
//    @Autowired
//    private RabbitProducer rabbitProducer;
//
//    public RabbitController(RabbitProducer rabbitProducer) {
//        this.rabbitProducer = rabbitProducer;
//    }
//
//    @GetMapping("/send")
//    public String getMessage(@RequestParam String message) {
//        rabbitProducer.sendMessage(message);
//        return "Message sent from tms-run: " + message;
//    }
//}
