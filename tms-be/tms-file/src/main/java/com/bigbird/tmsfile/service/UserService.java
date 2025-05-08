package com.tms_file.service;

import com.tms_file.cmmn.exception.ResourceNotFoundException;
import com.tms_file.cmmn.util.TokenUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    @Value("${bzw.user.file.url}")
    private String bzwApiUserFile;

    @Value("${bzw.user.avatar.url}")
    private String bzwApiUserAvatarUrl;

    private final RestTemplate restTemplate;

    public String getAvatarUrl(String groupId) {
        try {
            String url = bzwApiUserFile.replace("{groupId}", String.valueOf(groupId));
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + TokenUtils.getJwtFromContext().getTokenValue());
            HttpEntity<?> httpEntity = new HttpEntity<>(headers);
            ResponseEntity<?> responseEntity = restTemplate.exchange(url, HttpMethod.GET, httpEntity, Object.class);
            if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null) {
                Map<String, Object> fileMap = (Map<String, Object>) responseEntity.getBody();
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) fileMap.get("data");
                if(!dataList.isEmpty()){
                    Map<String, Object> data = dataList.get(dataList.size() - 1);
                    if (data != null) {
                        Integer fileSeq = (Integer) data.get("fileSeq");
                        return bzwApiUserAvatarUrl.concat(fileSeq.toString());
                    }
                }
                return null;
            } else {
                throw new RuntimeException("Failed to fetch group id");
            }
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get avatar url by group id: ", groupId);
        }
    }
}
