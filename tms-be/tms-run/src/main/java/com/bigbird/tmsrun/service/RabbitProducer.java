//package com.tms_run.service;
//
//import com.tms_run.cmmn.constant.RabbitConstant;
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
//        rabbitTemplate.convertAndSend(RabbitConstant.RUN_EXCHANGE, RabbitConstant.RUN_KEY, message);
//        System.out.println("tms-run sent message: " + message);
//    }
//}
