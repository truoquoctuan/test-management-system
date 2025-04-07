package com.bigbird.tmsrepo.cmmn.util;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Constant {
    /*CONFIG EMAIL:*/
    public static final String MY_EMAIL = "bzware01@gmail.com";
    public static final String MY_PASSWORD = "rhfptfamfyhbaelm";

    /*Thông báo cho testplan*/
    public static final String addMemberInProjectEN = "You have been added to the test plan <strong>%s</strong> by <strong>%s</strong>";
    public static final String changeStateProjectEN = "The status of the test plan <strong>%s</strong> has been changed to <strong>%s</strong>";
    public static final String changeRoleToOwnerEN = "You have been assigned as the owner of the test plan <strong>%s</strong> by <strong>%s</strong>";

    /*Tag trong bình luận*/
    public static final String commentTagEN = "<strong>%s</strong> mentioned you in a comment.";

    /*Giao phó testcase*/
    public static final String assignTestCaseEN = "You're been assigned to the test case <strong>%s</strong> testcase result.";

    /*Mail*/
    public static final String notifyMailTitleEN = "Notify from TMS";
    public static final String detailButtonEN = "View details";

    /*Cache*/
    public static final String FOLDER = "Folder";
    public static final String TEST_PLAN = "TestPlan";
    public static final String TEST_CASE = "TestCase";
    public static final String POSITION = "Position";
}
