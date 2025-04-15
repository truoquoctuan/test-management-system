//package com.tmsbe.tms_repo.tms_repo.service;
//
//import com.tmsbe.tms_repo.tms_repo.cmmn.constant.RabbitConstant;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.stereotype.Component;
//
//@Component
//public class RabbitConsumer {
//
//    @RabbitListener(queues = RabbitConstant.AUTH_QUEUE)
//    public void getMessage(String message) {
//
//        System.out.println("Receive message from tms-auth: " + message);
//    }
//}
