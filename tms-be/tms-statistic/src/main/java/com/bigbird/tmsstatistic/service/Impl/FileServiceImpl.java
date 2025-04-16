package com.tms_statistic.service.Impl;

import com.tms_statistic.cmmn.exception.ResourceNotFoundException;
import com.tms_statistic.entity.AttachFile;
import com.tms_statistic.repository.FileRepository;
import com.tms_statistic.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    private final FileRepository fileRepository;

    @Override
    public AttachFile getById(Long seq) {
        try {
            AttachFile attachFile = fileRepository.findById(seq).get();
            return attachFile;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not get file by seq: ", seq);
        }
    }

    @Override
    public String readFromFile(String path) {
        try {
            if (fileExists(path)) {
                byte[] fileBytes = Files.readAllBytes(Paths.get(path));
                return new String(fileBytes, StandardCharsets.UTF_8);
            }
            return "Unknown";
        } catch (IOException e) {
            throw new ResourceNotFoundException(e.getMessage(), "Cannot find file by path: ", path);
        }
    }

    @Override
    public void deleteFileCSVBySeq(Long seq) {
        fileRepository.deleteById(seq);
    }

    public boolean fileExists(String filePath) {
        File file = new File(filePath);
        return file.exists() && file.isFile(); // Kiểm tra cả tồn tại và chắc chắn là file
    }
}
