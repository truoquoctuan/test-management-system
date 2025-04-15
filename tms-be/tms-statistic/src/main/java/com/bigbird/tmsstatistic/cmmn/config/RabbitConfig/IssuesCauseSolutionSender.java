package com.tms_statistic.cmmn.config.RabbitConfig;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tms_statistic.cmmn.constant.RabbitConstant;
import com.tms_statistic.cmmn.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class IssuesCauseSolutionSender {
    private final RabbitTemplate rabbitTemplate;

    public Map<String, String> getCauseSolution(Long issuesId) {
        try {
            MessageProperties props = new MessageProperties();
            String replyQueue = RabbitConstant.ISSUES_CAUSE_SOLUTION_RESPONSE_QUEUE;
            props.setReplyTo(replyQueue);
            props.setCorrelationId(UUID.randomUUID().toString());
            rabbitTemplate.convertAndSend(
                    RabbitConstant.ISSUES_CAUSE_SOLUTION_EXCHANGE,
                    RabbitConstant.ISSUES_CAUSE_SOLUTION_KEY,
                    issuesId.toString(),
                    message -> {
                        message.getMessageProperties().setReplyTo(replyQueue);
                        message.getMessageProperties().setExpiration(RabbitConstant.WAIT_TIME.toString());
                        return message;
                    }
            );
            Message response = rabbitTemplate.receive(replyQueue, RabbitConstant.WAIT_TIME);

            if (response != null) {
                String responseBody = new String(response.getBody());
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, String> responseMap = objectMapper.readValue(responseBody, Map.class);
                return responseMap;
            } else {
                log.warn("No response received within the timeout period.");
                throw new ResourceNotFoundException("IssueCauseSolutionSender", "getCauseSolution", response);
            }
        } catch (AmqpException | JsonProcessingException e) {
            throw new RuntimeException("Error while getting the cause and solution", e);
        }
    }

}
