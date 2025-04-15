package com.tms_run.dto;

import com.tms_run.cmmn.base.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class IssuesPage {
    private List<IssuesDTO> issues;

    private PageInfo pageInfo;
}
