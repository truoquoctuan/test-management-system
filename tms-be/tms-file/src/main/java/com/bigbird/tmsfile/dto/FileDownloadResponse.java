package com.tms_file.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileDownloadResponse {

    private String contentType;
    private String contentDisposition;
    private String data;
}
