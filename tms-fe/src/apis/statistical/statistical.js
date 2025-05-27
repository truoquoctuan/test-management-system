import { gql } from '@apollo/client';

export const GET_TOTAL_ELEMENTBY_TEST_PLAN_ID = gql`
    query getTotalElementByTestPlanId($testPlanId: ID) {
        getTotalElementByTestPlanId(testPlanId: $testPlanId) {
            testCasesWithResults
            testCasesWithoutResults
            totalFolders
            totalTestCases
        }
    }
`;

export const GET_TEST_CASE_STATUS = gql`
    query getTestCaseStatus($testPlanId: ID) {
        getTestCaseStatus(testPlanId: $testPlanId) {
            count
            status
        }
    }
`;

export const GET_TEST_CASE_PRIORITY = gql`
    query getTestCasePriority($testPlanId: ID) {
        getTestCasePriority(testPlanId: $testPlanId) {
            count
            priority
        }
    }
`;

// Danh sách các test case trogn folder

export const GET_ALL_FOLDER_AND_TEST_CASE_RESULT = gql`
    query getAllFolderAndTestCaseResult($testPlanId: ID) {
        getAllFolderAndTestCaseResult(testPlanId: $testPlanId) {
            createdBy
            description
            folderId
            folderName
            sortOrder
            status
            testCases {
                priority
                resultStatus
                status
                testCaseId
                testCaseName
            }
            upperId
        }
    }
`;

//

export const GET_ALL_TEST_CASE_DETAIL = gql`
    query getAllTestCaseDetail($testCaseIds: [ID]!) {
        getAllTestCaseDetail(testCaseIds: $testCaseIds) {
            createdAt
            createdBy
            description
            expectResult
            folderId
            labelsInfo {
                labelColor
                labelId
                labelName
            }
            priority
            resultStatus
            status
            testCaseId
            testCaseName
            updatedAt
            users {
                fullName
                userID
                userName
            }
        }
    }
`;

// getAllResultInTestCase

export const GET_ALL_RESULT_IN_TESTCASE = gql`
    query getAllResultInTestCase($testCaseIds: [ID]!) {
        getAllResultInTestCase(testCaseIds: $testCaseIds) {
            data {
                assignId
                content
                createdAt
                status
                testResultId
                updatedAt
                userId
                assignUser {
                    fullName
                    userID
                    userName
                }
                creator {
                    fullName
                    userID
                    userName
                }
            }
            id
        }
    }
`;

// ----------------------------------

export const GET_TEST_CASE_IN_TEST_PLAN = gql`
    query getTestCaseInTestPlan($testPlanId: ID!, $page: Int, $size: Int) {
        getTestCaseInTestPlan(testPlanId: $testPlanId, page: $page, size: $size) {
            pageInfo {
                currentPage
                pageSize
                totalElements
                totalPages
            }
            testCases {
                testCaseId
                testCaseName
                users {
                    fullName
                    userID
                    userName
                }
                lastTestResult {
                    assignId
                    assignUsers {
                        fullName
                        userID
                        userName
                    }
                    content
                    createdAt
                    creator {
                        fullName
                        userID
                        userName
                    }
                    status
                    testCaseId
                    testResultId
                    updatedAt
                    userId
                    fileSeqs
                }
                labelsInfo {
                    labelColor
                    labelName
                    labelId
                    labelType
                }
                resultStatus
                priority
                status
                updatedAt
                folderId
                expectResult
                description
                createdBy
                createdAt
            }
        }
    }
`;
