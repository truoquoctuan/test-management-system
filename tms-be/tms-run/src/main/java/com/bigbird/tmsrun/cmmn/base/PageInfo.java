package com.tms_run.cmmn.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageInfo {

    private int totalPages;

    private int totalElements;

    private int currentPage;

    private int pageSize;
}
