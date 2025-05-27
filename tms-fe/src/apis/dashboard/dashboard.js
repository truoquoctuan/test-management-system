import { gql } from '@apollo/client';

// Thêm tiện ích
export const ADD_WIDGET = gql`
    mutation addWidget($userId: ID!, $widgetCodes: [Int!]) {
        addWidget(userId: $userId, widgetCodes: $widgetCodes)
    }
`;

// Danh sách tiện ích
export const GET_WIDGET_BY_USERID = gql`
    query getWidgetByUserId($userId: ID!) {
        getWidgetByUserId(userId: $userId) {
            userId
            widgetCode
            widgetId
        }
    }
`;

// Lấy testcase theo kết quả
export const GET_TEST_CASE_STATUS_DASHBOARD = gql`
    query getTestCaseStatusDashBoard($userId: ID!) {
        getTestCaseStatusDashboard(userId: $userId) {
            count
            status
        }
    }
`;

//Lấy testcase theo độ quan trọng
export const GET_TEST_CASE_PRIORITY_DASHBOARD = gql`
    query getTestCasePriorityDashBoard($userId: ID!) {
        getTestCasePriorityDashboard(userId: $userId) {
            count
            priority
        }
    }
`;

// Lấy tổng số folder

export const GET_TOTAL_FOLDER_DASHBOARD = gql`
    query getTotalFolderDashBoard($userId: ID!) {
        getTotalFolderDashboard(userId: $userId) {
            totalFolder
            totalRanFolder
            totalStoppedFolder
        }
    }
`;

// Lấy tổng số test case

export const GET_TOTAL_TEST_CASE_DASHBOARD = gql`
    query getTotalTestCaseDashBoard($userId: ID!) {
        getTotalTestCaseDashboard(userId: $userId) {
            totalExecuteTestCase
            totalPendTestCase
            totalTestCase
        }
    }
`;
// Lấy tổng số test plan

export const GET_TOTAL_TEST_PLAN_DASHBOARD = gql`
    query getToTalTestPlanDashBoard($userId: ID!) {
        getToTalTestPlanDashboard(userId: $userId) {
            totalActiveTestPlan
            totalArchiveTestPlan
            totalTestPlan
        }
    }
`;

// Xóa widget

export const DELETE_WIDGET = gql`
    mutation deleteWidget($widgetIds: [ID!]) {
        deleteWidget(widgetIds: $widgetIds)
    }
`;

// Danh sachs test pland

export const GET_TEST_PLANS_DASHBOARD = gql`
    query getAllTestPlan($page: Int!, $size: Int!, $userId: ID!, $status: Int, $sorted: String, $createdBys: [ID]) {
        getAllTestPlan(
            userId: $userId
            page: $page
            size: $size
            status: $status
            sorted: $sorted
            createdBys: $createdBys
        ) {
            testPlans {
                status
                testPlanId
                testPlanName
            }
        }
    }
`;
