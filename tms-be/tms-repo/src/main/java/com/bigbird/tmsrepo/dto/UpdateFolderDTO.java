package com.bigbird.tmsrepo.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFolderDTO {

    private Long folderId;

    private String folderName;

    private String description;
}
