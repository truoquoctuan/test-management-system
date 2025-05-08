package com.tms_file.service;

import com.tms_file.dto.CauseSolutionDTO;
import com.tms_file.dto.FileDownloadResponse;
import com.tms_file.dto.ImageResponse;
import com.tms_file.dto.StatusDTO;
import com.tms_file.entity.AttachFile;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;

public interface FileService {

    StatusDTO deleteFileBySeq(Long id);

    List<AttachFile> getListFileByGroupId(String id);

    ImageResponse displayImage(Long seq) throws IOException;

    FileDownloadResponse downloadFile(Long id) throws IOException;

    AttachFile getBySeqId(Long seq);

    Boolean saveCauseSolution(Long issuesId, String cause, String solution);
    CauseSolutionDTO getCauseAndSolution(Long issuesId);
}
