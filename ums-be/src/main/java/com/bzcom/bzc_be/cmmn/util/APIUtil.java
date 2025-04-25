package com.bzcom.bzc_be.cmmn.util;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class APIUtil {

    private APIUtil() {}

    public static ResponseEntity<?> exchange(MediaType contentType, String token,
                                             String url, HttpMethod request,
                                             Class<?> responseType, Object body) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(contentType);
        headers.setBearerAuth(token);

        HttpEntity<?> requestEntity = new HttpEntity<>(body, headers);

        return restTemplate.exchange(url, request, requestEntity, responseType);
    }
}
