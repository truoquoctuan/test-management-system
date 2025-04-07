package com.bigbird.tmsrepo.dto;

import com.bigbird.tmsrepo.cmmn.base.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FolderPage {

    private List<FolderDTO> folders;

    private PageInfo pageInfo;
}
