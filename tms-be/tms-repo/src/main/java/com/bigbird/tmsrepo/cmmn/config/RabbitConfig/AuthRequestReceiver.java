package com.bigbird.tmsrepo.cmmn.config.RabbitConfig;

import com.bigbird.tmsrepo.cmmn.constant.RabbitConstant;
import com.bigbird.tmsrepo.repository.TestPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthRequestReceiver {
    private final RabbitTemplate rabbitTemplate;
    private final TestPlanRepository testPlanRepository;

    private Map<String, String> deserializeMap(byte[] serializedData) {
        try (ByteArrayInputStream bis = new ByteArrayInputStream(serializedData);
             ObjectInputStream ois = new ObjectInputStream(bis)) {
            return (Map<String, String>) ois.readObject();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RabbitListener(queues = RabbitConstant.MEMBER_ROLE_QUEUE)
    public void receiveAuthUserRoleRequest(Message message) {
        try {
            Map<String, String> requestPayload = deserializeMap(message.getBody());
            if (requestPayload != null) {
                String userId = requestPayload.get("userId");
                String testPlanId = requestPayload.get("testPlanId");
                Integer role = testPlanRepository.getRoleInTestPlan(userId, Long.valueOf(testPlanId));
                MessageProperties replyProps = new MessageProperties();
                replyProps.setCorrelationId(message.getMessageProperties().getCorrelationId());
                replyProps.setExpiration("5000");
                Message replyMessage = new Message(role.toString().getBytes(), replyProps);
                rabbitTemplate.send(message.getMessageProperties().getReplyTo(), replyMessage);
            }
        } catch (Exception e) {
            log.error("Error processing auth request: ", e);
            throw new AmqpRejectAndDontRequeueException("Error processing auth request", e);
        }
    }

}