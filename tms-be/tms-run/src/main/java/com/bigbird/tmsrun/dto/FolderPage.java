package com.tms_run.dto;

import com.tms_run.cmmn.base.PageInfo;
import com.tms_run.entity.Folder;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FolderPage {

    private List<Folder> folders;

    private PageInfo pageInfo;
}
