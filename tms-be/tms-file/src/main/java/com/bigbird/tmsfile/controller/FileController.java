package com.tms_file.controller;


import com.tms_file.cmmn.util.FileUtil;
import com.tms_file.dto.*;
import com.tms_file.entity.AttachFile;
import com.tms_file.service.FileService;
import com.tms_file.service.UserService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@Slf4j
public class FileController {

    private final FileService fileService;
    private final UserService userService;
    private final ServletContext servletContext;

    public FileController(FileService fileService, UserService userService, HttpServletRequest request, ServletContext servletContext) {
        this.fileService = fileService;
        this.userService = userService;
        this.servletContext = servletContext;
    }

    @QueryMapping
    public KeyResponse generateKey() {
        Map<String, String> data = new HashMap<>();
        data.put("key", String.format("utk:%s", UUID.randomUUID().toString()));

        KeyResponse response = new KeyResponse();
        response.setKey(data.get("key"));
        response.setMessage("Successfully!");

        return response;
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteFileBySeq")
    public StatusDTO deleteFileBySeq(@Argument Long id) {
        return fileService.deleteFileBySeq(id);
    }

    @QueryMapping
    public List<AttachFile> getListFileByGroupId(@Argument String id) {
        return fileService.getListFileByGroupId(id);
    }

    @QueryMapping
    public ImageResponse displayImg(@Argument Long seq) throws IOException {
        return fileService.displayImage(seq);
    }

    @SchemaMapping(typeName = "Mutation", field = "downloadFile")
    public FileDownloadResponse downloadFile(@Argument Long id) throws IOException {
        return fileService.downloadFile(id);
    }

    @QueryMapping
    public String getUserAvatar(@Argument String groupId) throws IOException {
        return userService.getAvatarUrl(groupId);
    }

    @GetMapping("/displayImg/{seq}")
    public ResponseEntity<Object> displayImgAPI(@PathVariable(value = "seq") Long seq) throws UnsupportedEncodingException {
        AttachFile file = fileService.getBySeqId(seq);

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
            String fileName = URLEncoder.encode(file.getFileName(), String.valueOf(StandardCharsets.UTF_8)).replace("+", "%20");
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=\"" + fileName + "\";filename*=UTF-8''" + fileName)
                    .body(resource);
        } else {
            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body("<script>alert('file not found')</script>");
        }
    }
}
