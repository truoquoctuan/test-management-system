//package com.tms_run.service;
//
//import com.tms_run.cmmn.constant.RabbitConstant;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.stereotype.Component;
//
//@Component
//public class RabbitConsumer {
//
//    @RabbitListener(queues = RabbitConstant.REPO_QUEUE)
//    public void getMessage(String message) {
//        System.out.println("Receive message from tms-repo: " + message);
//    }
//}
