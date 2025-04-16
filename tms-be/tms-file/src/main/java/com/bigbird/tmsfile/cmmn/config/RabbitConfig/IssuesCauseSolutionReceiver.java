package com.tms_file.cmmn.config.RabbitConfig;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tms_file.cmmn.constant.RabbitConstant;
import com.tms_file.dto.CauseSolutionDTO;
import com.tms_file.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class IssuesCauseSolutionReceiver {
    private final FileService fileService;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = RabbitConstant.ISSUES_CAUSE_SOLUTION_QUEUE)
    public void receiveStatisticIssuesCauseSolutionRequest(Message message) {
        try {
            String issuesIdString = new String(message.getBody()).replaceAll("\"", "");
            Long issuesId = Long.parseLong(issuesIdString);
            CauseSolutionDTO causeSolution = fileService.getCauseAndSolution(issuesId);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("cause", causeSolution.getCause());
            responseMap.put("solution", causeSolution.getSolution());
            String responseJson = new ObjectMapper().writeValueAsString(responseMap);
            MessageProperties replyProps = new MessageProperties();
            replyProps.setCorrelationId(message.getMessageProperties().getCorrelationId());
            replyProps.setExpiration("5000");
            Message replyMessage = new Message(responseJson.getBytes(), replyProps);
            rabbitTemplate.send(message.getMessageProperties().getReplyTo(), replyMessage);
        } catch (Exception e) {
            throw new RuntimeException("Error processing request", e);
        }
    }

    @RabbitListener(queues = RabbitConstant.RUN_ISSUES_CAUSE_SOLUTION_QUEUE)
    public void receiveRunIssuesCauseSolutionRequest(Message message) {
        try {
            String issuesIdString = new String(message.getBody()).replaceAll("\"", "");
            Long issuesId = Long.parseLong(issuesIdString);
            CauseSolutionDTO causeSolution = fileService.getCauseAndSolution(issuesId);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("cause", causeSolution.getCause());
            responseMap.put("solution", causeSolution.getSolution());
            String responseJson = new ObjectMapper().writeValueAsString(responseMap);
            MessageProperties replyProps = new MessageProperties();
            replyProps.setCorrelationId(message.getMessageProperties().getCorrelationId());
            replyProps.setExpiration("5000");
            Message replyMessage = new Message(responseJson.getBytes(), replyProps);
            rabbitTemplate.send(message.getMessageProperties().getReplyTo(), replyMessage);
        } catch (Exception e) {
            throw new RuntimeException("Error processing request", e);
        }
    }

    @RabbitListener(queues = RabbitConstant.SAVE_ISSUES_CAUSE_SOLUTION_QUEUE)
    public void receiveSaveIssuesCauseSolutionRequest(Message message) {
        try {
            String json = new String(message.getBody(), StandardCharsets.UTF_8);
            Map<String, String> requestPayload = new ObjectMapper().readValue(json, new TypeReference<Map<String, String>>() {
            });
            Long issuesId = Long.parseLong(requestPayload.get("issuesId"));
            String cause = requestPayload.get("cause");
            String solution = requestPayload.get("solution");
            Boolean result = fileService.saveCauseSolution(issuesId, cause, solution);
            String responseJson = new ObjectMapper().writeValueAsString(result ? "Y" : "N");
            MessageProperties replyProps = new MessageProperties();
            replyProps.setCorrelationId(message.getMessageProperties().getCorrelationId());
            replyProps.setExpiration("5000");
            replyProps.setContentType("application/json");
            Message replyMessage = new Message(responseJson.getBytes(StandardCharsets.UTF_8), replyProps);
            rabbitTemplate.send(message.getMessageProperties().getReplyTo(), replyMessage);
        } catch (Exception e) {
            log.error("Error processing save cause solution request: ", e);
            throw new RuntimeException("Error processing request", e);
        }
    }

}
