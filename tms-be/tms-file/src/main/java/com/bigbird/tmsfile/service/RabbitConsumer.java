//package com.tms_file.service;
//
//import com.tms_file.cmmn.constant.RabbitConstant;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.stereotype.Component;
//
//@Component
//public class RabbitConsumer {
//
//    @RabbitListener(queues = RabbitConstant.RUN_QUEUE)
//    public void getMessage(String message) {
//        System.out.println("Receive message from tms-run: " + message);
//    }
//}
