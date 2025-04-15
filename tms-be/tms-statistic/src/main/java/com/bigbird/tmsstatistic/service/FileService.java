package com.tms_statistic.service;

import com.tms_statistic.entity.AttachFile;

public interface FileService {
    AttachFile getById(Long seq);
    String readFromFile(String path);
    void deleteFileCSVBySeq(Long seq);
}
