package com.tms_file.controller;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import com.tms_file.cmmn.util.Base64Util;
import com.tms_file.cmmn.util.FileUtil;
import com.tms_file.entity.AttachFile;
import com.tms_file.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@DgsComponent
@RequiredArgsConstructor
@Slf4j
public class UploadController {
    private final FileRepository fileRepository;

    private static final int BUFFER_SIZE = 512 * 1024;
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; //10MB

    @DgsMutation
    public AttachFile uploadFile(@InputArgument MultipartFile file, @InputArgument String uploadKey, @InputArgument String name, @InputArgument Integer chunk, @InputArgument Integer chunks) throws IOException {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds the maximum allowed size of " + (MAX_FILE_SIZE / (1024 * 1024)) + " MB");
        }

        String uploadDir = FileUtil.getUploadPath();
        String middleDir = DateFormatUtils.format(new Date(), "/yyyy/MM/");
        String fileName = Base64Util.encodeString(name);

        String destName = uploadDir + middleDir + fileName;

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
            String saveName = middleDir + UUID.randomUUID().toString() + "." + FilenameUtils.getExtension(name);
            if (destFile.renameTo(new File(uploadDir + saveName))) {
                AttachFile attachFile = new AttachFile();
                attachFile.setGroupId(uploadKey);
                attachFile.setFileName(name);
                attachFile.setFileSize(size);
                attachFile.setSaveNm(saveName);
                attachFile.setSaveDt(LocalDateTime.now());
                return fileRepository.save(attachFile);
            }
        }
        return null;
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
            log.error(e.getMessage());
        }
    }
}
