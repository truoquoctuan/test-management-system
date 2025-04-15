//package com.tms_run.cmmn.config;
//
//import io.github.cdimascio.dotenv.Dotenv;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//
//@Configuration
//public class DotenvConfig {
//
//    private static final Logger logger = LoggerFactory.getLogger(DotenvConfig.class);
//
//    @Bean
//    public Dotenv dotenv() {
//        Path dotenvPath = Paths.get(".env");
//
//        if (!Files.exists(dotenvPath)) {
//            logger.error("Could not find .env file at " + dotenvPath.toAbsolutePath());
//            throw new IllegalStateException("Could not find .env file at " + dotenvPath.toAbsolutePath());
//        }
//
//        Dotenv dotenv = Dotenv.load();
//        dotenv.entries().forEach(entry -> {
//            System.setProperty(entry.getKey(), entry.getValue());
//            logger.debug("Loaded environment variable: {}={}", entry.getKey(), entry.getValue());
//        });
//
//        logger.info(".env file successfully loaded from " + dotenvPath.toAbsolutePath());
//        return dotenv;
//    }
//}