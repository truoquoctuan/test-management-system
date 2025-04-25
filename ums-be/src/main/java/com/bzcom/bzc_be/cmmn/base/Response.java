package com.bzcom.bzc_be.cmmn.base;

import lombok.Data;

import java.util.List;

@Data
public class Response {

    private List<?> dataList;

    private Object data;

    private String message;

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
}
