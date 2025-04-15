package com.tms_statistic.cmmn.constant;

public final class RabbitConstant {

    public static final Integer WAIT_TIME = 5000;

    //  exchange
    public static final String AUTH_EXCHANGE = "tms-auth";
    public static final String REPO_EXCHANGE = "tms-repo";
    public static final String RUN_EXCHANGE = "tms-run";
    public static final String STATISTIC_EXCHANGE = "tms-statistic";
    public static final String ISSUES_CAUSE_SOLUTION_EXCHANGE = "issues-cause-solution-exchange";

    //  queue
    public static final String AUTH_QUEUE = "tms-auth";
    public static final String REPO_QUEUE = "tms-repo";
    public static final String RUN_QUEUE = "tms-run";
    public static final String STATISTIC_QUEUE = "tms-statistic";
    public static final String ISSUES_CAUSE_SOLUTION_QUEUE = "issues-cause-solution-queue";
    public static final String ISSUES_CAUSE_SOLUTION_RESPONSE_QUEUE = "issues-cause-solution-response-queue";


    //  key
    public static final String AUTH_KEY = "tms-auth";
    public static final String REPO_KEY = "tms-repo";
    public static final String RUN_KEY = "tms-run";
    public static final String STATISTIC_KEY = "tms-statistic";
    public static final String ISSUES_CAUSE_SOLUTION_KEY = "issues-cause-solution-key";

}
