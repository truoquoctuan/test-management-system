package com.bzcom.bzc_be.controller;

import com.bzcom.bzc_be.cmmn.base.Response;
import com.bzcom.bzc_be.cmmn.util.Base64Util;
import com.bzcom.bzc_be.cmmn.util.FileUtil;
import com.bzcom.bzc_be.entity.AttachFile;
import com.bzcom.bzc_be.service.FileService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/file")
public class FileController {

    private static final int BUFFER_SIZE = 512 * 1024;

    @Autowired
    private FileService fileService;

    @PostMapping
    public ResponseEntity<?> upload(@RequestBody MultipartFile file, @RequestParam Map<String, Object> param) throws IOException {

        ResponseEntity<?> result = null;

        String uploadDir = FileUtil.getUploadPath();
        String uploadKey = MapUtils.getString(param, "uploadKey");
        String fileName = MapUtils.getString(param, "name");
        Integer chunk = MapUtils.getInteger(param, "chunk", 0);
        Integer chunks = MapUtils.getInteger(param, "chunks", 0);

        String middleDir = DateFormatUtils.format(new Date(), "/yyyy/MM/");
        String destName = uploadDir + middleDir + Base64Util.encodeString(fileName);

        File destFile = new File(destName);
        if (!destFile.getParentFile().exists()) {
            destFile.getParentFile().mkdirs();
        }

        if (chunk == 0 && destFile.exists()) {
            FileUtil.deleteFile(destFile);
            destFile = new File(destName);
        }

        appendFile(file.getInputStream(), destFile);

        if (chunk == chunks - 1 || (chunk == 0 && chunks == 0)) {
            long size = destFile.length();
            String saveName = middleDir + UUID.randomUUID().toString() + "." + FilenameUtils.getExtension(fileName);
            if (destFile.renameTo(new File(uploadDir + saveName))) {
                AttachFile attachFile = new AttachFile();
                attachFile.setGroupId(uploadKey);
                attachFile.setFileNm(fileName);
                attachFile.setFileSize(size);
                attachFile.setSaveNm(saveName);
                result = fileService.save(attachFile);
            }
        }
        return result;
    }

    private void appendFile(InputStream in, File destFile) {

        boolean append = destFile.exists();

        try (OutputStream out = new BufferedOutputStream(new FileOutputStream(destFile, append), BUFFER_SIZE)) {
            in = new BufferedInputStream(in, BUFFER_SIZE);

            int len;
            byte[] buffer = new byte[BUFFER_SIZE];
            while ((len = in.read(buffer)) > 0) {
                out.write(buffer, 0, len);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/key")
    public ResponseEntity<?> key() {
        Map<String, String> data = new HashMap<>();
        data.put("key", String.format("utk:%s", UUID.randomUUID().toString()));
        return ResponseEntity.ok(new Response().setData(data).setMessage("Successfully!"));
    }


    @DeleteMapping("/{seq}")
    public ResponseEntity<?> delete(@PathVariable(value = "seq") Long seq) {
        return fileService.checkDelete(seq);
    }


    @GetMapping("/list/{groupId}")
    public ResponseEntity<?> list(@PathVariable(value = "groupId") String groupId) {
        return fileService.selectFile(groupId);
    }

    @GetMapping("/{seq}")
    public ResponseEntity<Object> download(HttpServletRequest request, @PathVariable(value = "seq") Long seq) throws UnsupportedEncodingException {

        Response response = (Response) fileService.find(seq).getBody();
        AttachFile file = (AttachFile) response.getData();

        String saveName = FileUtil.getUploadPath() + file.getSaveNm();

        Resource resource = new FileSystemResource(saveName);

        if (resource.exists()) {
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                ex.printStackTrace();
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String fileName = URLEncoder.encode(file.getFileNm(), String.valueOf(StandardCharsets.UTF_8)).replace("+", "%20");

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName + ";filename*= UTF-8''" + fileName)
                    .body(resource);
        } else {
            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body("<script>alert('file not found')</script>");
        }
    }

    @GetMapping("/displayImg/{seq}")
    public ResponseEntity<Object> displayImg(HttpServletRequest request, @PathVariable(value = "seq") Long seq) throws UnsupportedEncodingException {
        CacheControl cacheControl = CacheControl.maxAge(30, TimeUnit.DAYS);
        Response response = (Response) fileService.find(seq).getBody();
        AttachFile file = (AttachFile) response.getData();

        String saveName = FileUtil.getUploadPath() + file.getSaveNm();

        Resource resource = new FileSystemResource(saveName);

        if (resource.exists()) {
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                ex.printStackTrace();
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String fileName = URLEncoder.encode(file.getFileNm(), String.valueOf(StandardCharsets.UTF_8)).replace("+", "%20");

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=" + fileName + ";filename*= UTF-8''" + fileName)
                    .cacheControl(cacheControl)
                    .body(resource);
        } else {
            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body("<script>alert('file not found')</script>");
        }

    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestParam String uploadKey, @RequestParam String entityNm, @RequestParam String entityId) {
        try {
            if (StringUtils.isNotEmpty(uploadKey) && StringUtils.isNotEmpty(entityNm)) {
                String groupId = String.format("%s-%s", entityNm, entityId);
                fileService.updateGroupId(uploadKey, groupId);
                return ResponseEntity.status(HttpStatus.OK).body("Save successfully!");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Param can't null!");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
}
