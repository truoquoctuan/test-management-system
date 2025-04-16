package com.tms_statistic.controller;

import com.tms_statistic.cmmn.util.FileUtil;
import com.tms_statistic.entity.AttachFile;
import com.tms_statistic.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/download")
@RequiredArgsConstructor
public class DownloadController {
    private final FileService fileService;

    @GetMapping("/csv/{seq}")
    public ResponseEntity<StreamingResponseBody> downloadFileCSV(@PathVariable("seq") Long seq) throws UnsupportedEncodingException {
        AttachFile file = fileService.getById(seq);
        String saveNm = FileUtil.getUploadPath() + file.getSaveNm();
        File fileToDownload = new File(saveNm);
        if (!fileToDownload.exists()) {
            throw new RuntimeException("File not found with seq: " + seq);
        }
        String contentType = "application/octet-stream";
        String fileName = URLEncoder.encode(file.getFileName(), String.valueOf(StandardCharsets.UTF_8)).replace("+", "%20");
        StreamingResponseBody stream = out -> {
            try (InputStream inputStream = new FileInputStream(fileToDownload)) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                out.flush();
            } finally {
                /*Clear csv content*/
                fileService.deleteFileCSVBySeq(seq);
                FileUtil.deleteFile(saveNm);
            }
        };
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName + ";filename*=UTF-8''" + fileName)
                .body(stream);
    }

}
