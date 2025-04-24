package com.bzcom.bzc_be.service.impl;

import com.bzcom.bzc_be.cmmn.base.Response;
import com.bzcom.bzc_be.entity.AttachFile;
import com.bzcom.bzc_be.repository.FileRepository;
import com.bzcom.bzc_be.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    public FileRepository fileRepository;


    @Override
    public ResponseEntity<?> select() {
        List<AttachFile> result = fileRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @Override
    public ResponseEntity<?> find(Long seq) {
        Optional<AttachFile> attachFile = fileRepository.findById(seq);
        if (attachFile.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(new Response().setData(attachFile.get()).setMessage("Successfully!"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found!");
        }
    }

    @Override
    public ResponseEntity<?> delete(Long seq) {
        fileRepository.deleteById(seq);
        return ResponseEntity.status(HttpStatus.OK).body("Deleted!");
    }

    @Override
    public ResponseEntity<?> save(AttachFile file) {
        try {
            AttachFile saveEntity = fileRepository.save(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(new Response().setData(saveEntity).setMessage("Saved!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Can't save file!");
        }
    }

    @Override
    public ResponseEntity<?> checkDelete(Long seq) {
        ResponseEntity<?> response = null;
        Optional<AttachFile> entity = fileRepository.findById(seq);
        if (entity.isPresent()) {
            AttachFile file = entity.get();
            file.setGroupId("utk:delete");
            fileRepository.save(file);
            response = ResponseEntity.ok(new Response().setMessage("Successfully!"));
        } else {
            response = ResponseEntity.ok(new Response().setMessage("Not found entity!"));
        }
        return response;
    }

    @Override
    public ResponseEntity<?> selectFile(String groupId) {
        return ResponseEntity.status(HttpStatus.OK).body(new Response().setData(fileRepository.findByGroupId(groupId)).setMessage("Successfully!"));
    }

    @Override
    public void updateGroupId(String uploadKey, String groupId) {
        List<AttachFile> fileList = fileRepository.findByGroupId(uploadKey);
        for (AttachFile file : fileList) {
            file.setGroupId(groupId);
            AttachFile result = fileRepository.save(file);
        }
    }
}
