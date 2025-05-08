package com.tms_file.service.Impl;

import com.tms_file.cmmn.base.BaseCrudService;
import com.tms_file.cmmn.base.Response;
import com.tms_file.cmmn.util.Base64Util;
import com.tms_file.cmmn.util.FileUtil;
import com.tms_file.dto.CauseSolutionDTO;
import com.tms_file.dto.FileDownloadResponse;
import com.tms_file.dto.ImageResponse;
import com.tms_file.dto.StatusDTO;
import com.tms_file.entity.AttachFile;
import com.tms_file.repository.FileRepository;
import com.tms_file.service.FileService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.time.DateFormatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class FileServiceImpl extends BaseCrudService<AttachFile, Long> implements FileService {

    private final FileRepository fileRepository;

    @Autowired
    private ServletContext servletContext;

    @Autowired
    private HttpServletRequest request;

    private static final int BUFFER_SIZE = 512 * 1024;

    public FileServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public StatusDTO deleteFileBySeq(Long seq) {
        Optional<AttachFile> attachFile = fileRepository.findById(seq);
        if (attachFile.isPresent()) {
            AttachFile file = attachFile.get();
            file.setGroupId("utk:delete");
            fileRepository.save(file);
            return new StatusDTO(true, "File deleted successfully");
        } else {
            return new StatusDTO(true, "File not found");
        }
    }

    @Override
    public List<AttachFile> getListFileByGroupId(String groupId) {
        return fileRepository.findByGroupId(groupId);
    }

    @Override
    public ImageResponse displayImage(Long seq) throws IOException {
        AttachFile file = fileRepository.findFileBySeq(seq);

        String saveName = FileUtil.getUploadPath() + file.getSaveNm();
        Resource resource = new FileSystemResource(saveName);

        if (resource.exists()) {
            String contentType = null;
            try {
                contentType = servletContext.getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                ex.printStackTrace();
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            byte[] imageData = resource.getInputStream().readAllBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageData);

            return new ImageResponse(file.getFileSeq(), file.getFileName(), contentType, base64Image);
        } else {
            throw new RuntimeException("File not found");
        }
    }

    @Override
    public FileDownloadResponse downloadFile(Long seq) throws IOException {
        Response response = (Response) find(seq).getBody();
        AttachFile file = (AttachFile) response.getData();

        String saveName = FileUtil.getUploadPath() + file.getSaveNm();
        Resource resource = new FileSystemResource(saveName);

        if (resource.exists()) {
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                System.out.println("Could not determine file type.");
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String fileName = URLEncoder.encode(file.getFileName(), String.valueOf(StandardCharsets.UTF_8)).replace("+", "%20");

            FileDownloadResponse fileDownloadResponse = new FileDownloadResponse();
            fileDownloadResponse.setContentType(contentType);
            fileDownloadResponse.setContentDisposition("attachment;filename=" + fileName + ";filename*= UTF-8''" + fileName);
            fileDownloadResponse.setData(resource.getURI().toString());

            return fileDownloadResponse;
        } else {
            throw new RuntimeException("File not found");
        }
    }

    @Override
    public AttachFile getBySeqId(Long seq) {
        try {
            return fileRepository.findFileBySeq(seq);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Boolean saveCauseSolution(Long issuesId, String cause, String solution) {
        try {
            String uploadDir = FileUtil.getUploadPath();
            String middleDir = DateFormatUtils.format(new Date(), "/yyyy/MM/");

            String fileNameCause = "Issues-" + issuesId + "-c.txt";
            String fileNameSolution = "Issues-" + issuesId + "-s.txt";

            String destNameCause = uploadDir + middleDir + Base64Util.encodeString(fileNameCause);
            String destNameSolution = uploadDir + middleDir + Base64Util.encodeString(fileNameSolution);

            String groupId = "Issues-" + issuesId + "-cs";
            saveContentToFile(cause, destNameCause, fileNameCause, groupId);
            saveContentToFile(solution, destNameSolution, fileNameSolution, groupId);

            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public CauseSolutionDTO getCauseAndSolution(Long issuesId) {
        try {
            String groupId = "Issues-" + issuesId + "-cs";
            List<AttachFile> attachFiles = fileRepository.findByGroupId(groupId);
            CauseSolutionDTO rs = new CauseSolutionDTO();
            for (AttachFile attachFile : attachFiles) {
                String filePath = FileUtil.getUploadPath() + attachFile.getSaveNm();
                Path path = Paths.get(filePath);
                if (!Files.exists(path)) {
                    String defaultContent = "Content is not exists";
                    Files.write(path, defaultContent.getBytes(), StandardOpenOption.CREATE);
                }
                String content = new String(Files.readAllBytes(path));
                if (attachFile.getFileName().contains(issuesId + "-c")) {
                    rs.setCause(content);
                } else {
                    rs.setSolution(content);
                }
            }
            return rs;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<?> find(Long seq) {
        Optional<AttachFile> entity = fileRepository.findById(seq);
        if (entity.isPresent()) {
            return ResponseEntity.ok(new Response().setData(entity.get()).setMessage("Found!"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private void saveContentToFile(String content, String destName, String fileName, String groupId) throws IOException {
        List<AttachFile> existingFiles = fileRepository.findByGroupId(groupId);
        File destFile = new File(destName);
        if (!destFile.getParentFile().exists()) {
            destFile.getParentFile().mkdirs();
        }
        boolean fileUpdated = false;
        if (!existingFiles.isEmpty()) {
            for (AttachFile existingFile : existingFiles) {
                if (existingFile.getFileName().equals(fileName)) {
                    File existingDestFile = new File(FileUtil.getUploadPath() + existingFile.getSaveNm());
                    if (existingDestFile.exists()) {
                        // Xóa nội dung cũ của file
                        new PrintWriter(existingDestFile).close();
                        appendContentToFile(content, existingDestFile);
                        existingFile.setFileSize(existingDestFile.length());
                        existingFile.setSaveDt(LocalDateTime.now());
                        fileRepository.save(existingFile);
                        fileUpdated = true;
                        break;
                    }
                }
            }
        }
        if (!fileUpdated) {
            appendContentToFile(content, destFile);
            long size = destFile.length();
            String saveName = DateFormatUtils.format(new Date(), "/yyyy/MM/") + UUID.randomUUID().toString() + ".txt";
            if (destFile.renameTo(new File(FileUtil.getUploadPath() + saveName))) {
                AttachFile attachFile = new AttachFile();
                attachFile.setGroupId(groupId);
                attachFile.setFileName(fileName);
                attachFile.setFileSize(size);
                attachFile.setSaveNm(saveName);
                attachFile.setSaveDt(LocalDateTime.now());
                fileRepository.save(attachFile);
            }
        }
    }

    private void appendContentToFile(String content, File destFile) throws IOException {
        boolean append = destFile.exists();
        try (OutputStream out = new BufferedOutputStream(new FileOutputStream(destFile, append), BUFFER_SIZE)) {
            byte[] buffer = content.getBytes();
            out.write(buffer, 0, buffer.length);
        }
    }
}

