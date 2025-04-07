package com.bigbird.tmsrepo.cmmn.constant;

public final class RabbitConstant {

    public static final Integer WAIT_TIME = 5000;

    //  EXCHANGE
    public static final String AUTH_EXCHANGE = "tms-auth";
    public static final String REPO_EXCHANGE = "tms-repo";
    public static final String MEMBER_ROLE_EXCHANGE = "member-role-exchange";
    public static final String AUTH_USERID_EXCHANGE = "auth-userID-exchange";
    public static final String AUTH_REQUEST_EXCHANGE = "auth-request-exchange";
    public static final String AUTH_RESPONSE_EXCHANGE = "auth-response-exchange";

    //  QUEUE
    public static final String AUTH_REQUEST_QUEUE = "auth-request-queue";
    public static final String AUTH_RESPONSE_QUEUE = "auth-response-queue";
    public static final String AUTH_REPLY_QUEUE = "auth-reply-queue";
    public static final String AUTH_QUEUE = "tms-auth";
    public static final String REPO_QUEUE = "tms-repo";
    public static final String MEMBER_ROLE_QUEUE = "member-role-queue";
    public static final String AUTH_USERID_QUEUE = "auth-userID-queue";
    public static final String AUTH_USERID_REPLY_QUEUE = "auth-userID-reply-queue";

    //  KEY
    public static final String AUTH_KEY = "tms-auth";
    public static final String REPO_KEY = "tms-repo";
    public static final String MEMBER_ROLE_KEY = "member.role.key";
    public static final String AUTH_USERID_KEY = "auth.userID";
    public static final String AUTH_REQUEST_KEY = "auth.request.key";
    public static final String AUTH_RESPONSE_KEY = "auth.response.key";

}
