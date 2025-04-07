package com.bigbird.tmsrepo.service.Impl;

import com.bigbird.tmsrepo.cmmn.exception.ResourceNotFoundException;
import com.bigbird.tmsrepo.cmmn.util.Constant;
import com.bigbird.tmsrepo.entity.Users;
import com.bigbird.tmsrepo.service.MailService;
import com.bigbird.tmsrepo.service.UsersService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {
    private final JavaMailSender javaMailSender;
    private final UsersService usersService;
    private ExecutorService executorService;
    private String emailTemplate;
    @Value("${domain.fe}")
    private String domainFe;

    @PostConstruct
    public void init() {
        try {
            Resource resource = new ClassPathResource("static/templates/emailtemplate.html");
            emailTemplate = StreamUtils.copyToString(resource.getInputStream(), Charset.defaultCharset());
            executorService = Executors.newFixedThreadPool(10);
        } catch (IOException e) {
            System.out.println("Error HTML file!");
        }
    }

    @PreDestroy
    public void shutdownExecutor() {
        if (executorService != null && !executorService.isShutdown()) {
            executorService.shutdown();
        }
    }

    @Override
    public void sendMail(String userId, String content, String link) {
        Users users = usersService.findUserById(userId);
        executorService.submit(() -> {
            try {
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");

                StringBuilder htmlMsg = new StringBuilder(emailTemplate);
                replacePlaceholder(htmlMsg, "{{notifyMailContent}}", content);
                replacePlaceholder(htmlMsg, "{{userName}}", users.getFullName());
                replacePlaceholder(htmlMsg, "{{link}}", domainFe.substring(0, domainFe.length() - 1) + link);
                replacePlaceholder(htmlMsg, "{{detailButton}}", Constant.detailButtonEN);

                helper.setSubject(content.replaceAll("<strong>", "").replaceAll("</strong>", ""));
                helper.setTo(users.getEmail());
                helper.setText(htmlMsg.toString(), true);

                javaMailSender.send(message);
            } catch (Exception e) {
                throw new ResourceNotFoundException(e.getMessage(), "Can not send email by userId: ", userId);
            }
        });
    }

    private void replacePlaceholder(StringBuilder sb, String placeholder, String value) {
        int index;
        while ((index = sb.indexOf(placeholder)) != -1) {
            sb.replace(index, index + placeholder.length(), value);
        }
    }
}
