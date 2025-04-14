package com.tms_run.cmmn.util;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Constant {
    /*CONFIG EMAIL:*/
    public static final String MY_EMAIL = "bzware01@gmail.com";
    public static final String MY_PASSWORD = "rhfptfamfyhbaelm";

    /*Giao phó testcase*/
    public static final String assignTestCaseEN = "You've been assigned to the test case <strong>%s</strong>.";

    /*Issues*/
    public static final String assignIssuesEN = "You've been assigned to the issue <strong>%s</strong>.";
    public static final String issuesChangeStatusEN = "The Issue <strong>%s</strong> has been changed to <strong>%s</strong> status.";
    public static final String saveIssuesCauseSolution = "<strong>%s</strong> has updated the cause and solution for the issue <strong>%s</strong>.";

    /*Tag comment*/
    public static final String commentTagEN = "<strong>%s</strong> mentioned you in a comment in the %s <strong>%s</strong>.";
    public static final String commentReplyEN = "<strong>%s</strong> replied to your comment in the issue <strong>%s</strong>.";

    /*mail*/
    public static final String notifyMailTitleEN = "Notify from TMS";
    public static final String detailButtonEN = "View details";
}
