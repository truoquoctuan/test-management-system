package com.tms_statistic;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

import java.util.TimeZone;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class TmsStatisticApplication {

    private static final Logger log = LoggerFactory.getLogger(TmsStatisticApplication.class);

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SpringApplication.run(TmsStatisticApplication.class, args);
    }

    @Component
    static class Initialize {

        @Autowired
        private ServletContext context;

        @PostConstruct
        public void init() {
            System.setProperty("webRoot", context.getRealPath(""));
            // TODO - war 및 jar 배포환경에서 디렉토리 정보 확인 필요

            String str = "\n" +
                    "\n=========================================================================================" +
                    "\n:: Application Initialize Info ::" +
                    "\n:: active profiles : " + System.getProperty("spring.profiles.active") +
                    "\n:: web root directory : " + System.getProperty("webRoot") +
                    "\n=========================================================================================" +
                    "\n";
            log.info(str);
        }
    }
}
