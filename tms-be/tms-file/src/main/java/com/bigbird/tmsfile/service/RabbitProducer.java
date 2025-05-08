//package com.tms_file.service;
//
//import com.tms_file.cmmn.constant.RabbitConstant;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//import org.springframework.stereotype.Component;
//
//@Component
//public class RabbitProducer {
//
//    private final RabbitTemplate rabbitTemplate;
//
//    public RabbitProducer(RabbitTemplate rabbitTemplate) {
//        this.rabbitTemplate = rabbitTemplate;
//    }
//
//    public void sendMessage(String message) {
//        rabbitTemplate.convertAndSend(RabbitConstant.FILE_EXCHANGE, RabbitConstant.FILE_KEY, message);
//        System.out.println("tms-file sent message: " + message);
//    }
//}
