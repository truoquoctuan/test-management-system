//package com.tms_statistic.service;
//
//import com.tms_statistic.cmmn.constant.RabbitConstant;
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
//        rabbitTemplate.convertAndSend(RabbitConstant.STATISTIC_EXCHANGE, RabbitConstant.STATISTIC_KEY, message);
//        System.out.println("tms-statistic sent message: " + message);
//    }
//}
