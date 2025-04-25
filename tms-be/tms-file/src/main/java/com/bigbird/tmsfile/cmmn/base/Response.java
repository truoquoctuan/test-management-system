package com.tms_file.cmmn.base;

import lombok.Data;

import java.util.List;

@Data
public class Response {
    private List<?> dataList;

    private Object data;

    private String message;

    private long total;

    private long page;

    private long size;

    public Response setDataList(List<?> dataList) {
        this.dataList = dataList;
        return this;
    }

    public Response setMessage(String message) {
        this.message = message;
        return this;
    }

    public Response setData(Object data) {
        this.data = data;
        return this;
    }

    public Response setTotal(long total) {
        this.total = total;
        return this;
    }

    public Response setPage(long page) {
        this.page = page;
        return this;
    }

    public Response setSize(long size) {
        this.size = size;
        return this;
    }


}

