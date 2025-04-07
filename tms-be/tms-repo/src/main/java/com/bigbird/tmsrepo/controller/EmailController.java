package com.bigbird.tmsrepo.controller;

import com.bigbird.tmsrepo.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/sendSimpleEmail")
@RequiredArgsConstructor
public class EmailController {

    private final JavaMailSender emailSender;
    private final MailService mailService;

    @GetMapping
    public String sendSimpleEmail() {
        Executor executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            mailService.sendMail("453", "Test", "test-plan/plan-information/2");
        });
        return "Email Sent!";
    }
}
