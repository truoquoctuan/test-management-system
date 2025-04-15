package com.tms_run.service.Impl;

import com.tms_run.cmmn.base.BaseCrudService;
import com.tms_run.entity.AttachFile;
import com.tms_run.repository.FileRepository;
import com.tms_run.service.FileService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileServiceImpl extends BaseCrudService<AttachFile, Long> implements FileService {

    private FileRepository fileRepository;

    public FileServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public void updateGroupId(String uploadKey, String groupId) {
        List<AttachFile> fileList = fileRepository.findFileByGroupId(uploadKey);
        for (AttachFile file : fileList) {
            file.setGroupId(groupId);
            fileRepository.save(file);
        }
    }
}
