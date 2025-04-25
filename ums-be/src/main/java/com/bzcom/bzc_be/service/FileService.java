package com.bzcom.bzc_be.service;

import com.bzcom.bzc_be.entity.AttachFile;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface FileService {
    ResponseEntity<?> select();

    ResponseEntity<?> find(Long seq);

    ResponseEntity<?> delete(Long seq);

    ResponseEntity<?> save(AttachFile file);

    ResponseEntity<?> checkDelete(Long seq);

    ResponseEntity<?> selectFile(String groupId);

    void updateGroupId(String uploadKey, String groupId);
}
