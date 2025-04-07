package com.bigbird.tmsrepo.socket;

public class ResponseNotify {
    private String content;

    public ResponseNotify() {
    }

    public ResponseNotify(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
