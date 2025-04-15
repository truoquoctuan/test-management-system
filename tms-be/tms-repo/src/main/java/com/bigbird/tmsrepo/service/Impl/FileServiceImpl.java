package com.bigbird.tmsrepo.service.Impl;

import com.bigbird.tmsrepo.cmmn.base.BaseCrudService;
import com.bigbird.tmsrepo.entity.AttachFile;
import com.bigbird.tmsrepo.repository.FileRepository;
import com.bigbird.tmsrepo.service.FileService;
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
