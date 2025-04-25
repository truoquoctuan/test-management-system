package com.bzcom.bzc_be;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class BzcBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(BzcBeApplication.class, args);
	}

	@Component
	static class Initialize {

		@Autowired
		private ServletContext context;

		@PostConstruct
		public void init() {
			System.setProperty("webRoot", context.getRealPath(""));
		}
	}
}
