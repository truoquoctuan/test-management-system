package com.tms_run.cmmn.constant;

public final class RabbitConstant {

    public static final Integer WAIT_TIME = 5000;

    //exchange
    public static final String AUTH_EXCHANGE = "tms-auth";
    public static final String REPO_EXCHANGE = "tms-repo";
    public static final String RUN_EXCHANGE = "tms-run";
    public static final String STATISTIC_EXCHANGE = "tms-statistic";
    public static final String AUTH_USERID_EXCHANGE = "auth-userID-exchange";
    public static final String MEMBER_ROLE_EXCHANGE = "member-role-exchange";
    public static final String ISSUES_CAUSE_SOLUTION_EXCHANGE = "run-issues-cause-solution-exchange";
    public static final String SAVE_ISSUES_CAUSE_SOLUTION_EXCHANGE = "run-save-issues-cause-solution-exchange";
    public static final String AUTH_REQUEST_EXCHANGE = "auth-request-exchange";
    public static final String AUTH_RESPONSE_EXCHANGE = "auth-response-exchange";

    //    queue
    public static final String AUTH_REQUEST_QUEUE = "auth-request-queue";
    public static final String AUTH_RESPONSE_QUEUE = "auth-response-queue";
    public static final String AUTH_REPLY_QUEUE = "auth-reply-queue";
    public static final String AUTH_QUEUE = "tms-auth";
    public static final String REPO_QUEUE = "tms-repo";
    public static final String RUN_QUEUE = "tms-run";
    public static final String STATISTIC_QUEUE = "tms-statistic";
    public static final String AUTH_USERID_QUEUE = "auth-userID-queue";
    public static final String AUTH_USERID_REPLY_QUEUE = "auth-userID-reply-queue";
    public static final String MEMBER_ROLE_QUEUE = "member-role-queue";
    public static final String ISSUES_CAUSE_SOLUTION_QUEUE = "run-issues-cause-solution-queue";
    public static final String SAVE_ISSUES_CAUSE_SOLUTION_QUEUE = "run-save-issues-cause-solution-queue";
    public static final String RUN_ISSUES_CAUSE_SOLUTION_RESPONSE_QUEUE = "run-issues-cause-solution-response-queue";
    public static final String SAVE_ISSUES_CAUSE_SOLUTION_RESPONSE_QUEUE = "run-save-cause-solution-response-queue";

    //    key
    public static final String AUTH_KEY = "tms-auth";
    public static final String REPO_KEY = "tms-repo";
    public static final String RUN_KEY = "tms-run";
    public static final String STATISTIC_KEY = "tms-statistic";
    public static final String AUTH_USERID_KEY = "auth.userID";
    public static final String MEMBER_ROLE_KEY = "member.role.key";
    public static final String ISSUES_CAUSE_SOLUTION_KEY = "run-issues-cause-solution-key";
    public static final String SAVE_ISSUES_CAUSE_SOLUTION_KEY = "run-save-issues-cause-solution-key";
    public static final String AUTH_REQUEST_KEY = "auth.request.key";
    public static final String AUTH_RESPONSE_KEY = "auth.response.key";

}