package com.tms_run.service;

import com.tms_run.cmmn.util.TokenUtils;
import com.tms_run.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UsersService {

    @Value("${user.info.url}")
    private String userInfoUrl;

    private final RestTemplate restTemplate;

    @Autowired
    public UsersService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private Users findUserCommon(String userId, String bzwUrl) {
        if (userId == null) return null;
        try {
            String url = bzwUrl.replace("{userId}", userId);
            Jwt jwt = TokenUtils.getJwtFromContext();
            if (jwt == null) {
                throw new RuntimeException("JWT token not found in SecurityContext.");
            }
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + jwt.getTokenValue());
            HttpEntity<?> httpEntity = new HttpEntity<>(headers);
            ResponseEntity<?> responseEntity = restTemplate.exchange(url, HttpMethod.GET, httpEntity, Object.class);
            if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null) {
                Map<String, Object> userMap = (Map<String, Object>) responseEntity.getBody();
                if (userMap != null) {
                    Users user = new Users();
                    user.setUserName(userMap.get("username").toString());
                    user.setFullName(userMap.get("lastName").toString() + " " + userMap.get("firstName"));
                    user.setEmail((String) userMap.get("email"));
                    user.setUserID(userId);
                    return user;
                }
            } else {
                throw new RuntimeException("Failed to fetch user");
            }
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while processing the request.");
        }
        return null;
    }

    public Users findUserById(String userId) {
        return findUserCommon(userId, userInfoUrl);
    }

    public Users findUserDisabledById(String userId) {
        return findUserCommon(userId, userInfoUrl);
    }

    public String getGroupId(String token, String url) throws Exception {
        String accessToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<?> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Object.class
        );
        if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null) {
            List<Map<String, Object>> responseBody = (List<Map<String, Object>>) responseEntity.getBody();
            return responseBody.get(0).get("id").toString();
        }
        return "";
    }

}

