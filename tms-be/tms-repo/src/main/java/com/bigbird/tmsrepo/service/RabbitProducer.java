//package com.tmsbe.tms_repo.tms_repo.service;
//
//import com.tmsbe.tms_repo.tms_repo.cmmn.constant.RabbitConstant;
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
//        rabbitTemplate.convertAndSend(RabbitConstant.REPO_EXCHANGE, RabbitConstant.REPO_KEY, message);
//        System.out.println("tms-repo sent message: " + message);
//    }
//}
