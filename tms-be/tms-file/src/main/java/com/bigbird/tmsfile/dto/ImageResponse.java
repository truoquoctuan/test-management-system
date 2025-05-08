package com.tms_file.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageResponse {

    private Long fileSeq;

    private String fileName;

    private String contentType;

    private String base64Image;
}
