import { gql } from '@apollo/client';

// Get danh sách test case
export const GET_ALL_TEST_CASE = gql`
    query getAllTestCase(
        $folderId: Int!
        $sorted: String
        $testCaseName: String
        $createdBys: [ID]
        $labelIds: [Int]
        $page: Int
        $size: Int
    ) {
        getAllTestCase(
            folderId: $folderId
            page: $page
            size: $size
            sorted: $sorted
            testCaseName: $testCaseName
            labelIds: $labelIds
            createdBys: $createdBys
        ) {
            pageInfo {
                currentPage
                pageSize
                totalElements
                totalPages
            }
            testCases {
                createdBy
                expectResult
                description
                priority
                status
                testCaseId
                testCaseName
            }
        }
    }
`;
// Xóa Test Case
export const DELETE_TEST_CASE_BY_ID = gql`
    mutation deleteTestCaseById($ids: [ID!]) {
        deleteTestCaseById(ids: $ids) {
            isSuccess
            message
        }
    }
`;
// Get chi tiết test case
export const GET_TEST_CASE_BY_ID = gql`
    query getTestCaseById($id: ID!) {
        getTestCaseById(id: $id) {
            testCaseId
            testCaseName
            description
            expectResult
            priority
            status
            createdBy
            createdAt
            updatedAt
            folderId
            userName
            fullName
            fileSeqs
            labels {
                testCaseLabelId
                labelId
            }
            labelsInfo {
                labelId
                labelName
                labelColor
            }
            files {
                fileSeq
                fileSize
                fileName
                groupId
                saveDt
                saveNm
                createdAt
                updatedAt
            }
        }
    }
`;
// Save Lable
export const SAVE_LABEL = gql`
    mutation saveLabel($labelColor: String, $labelId: ID, $labelType: Int, $labelName: String, $testPlanId: ID) {
        saveLabel(
            label: {
                labelColor: $labelColor
                labelId: $labelId
                labelName: $labelName
                testPlanId: $testPlanId
                labelType: $labelType
            }
        ) {
            labelColor
            labelId
            labelName
            labelType
            testCaseId
            testPlanId
        }
    }
`;
// Get all danh sách label
// labelName: $labelName,
// $labelName: String,
export const GET_ALL_LABEL_INTEST_PLAN = gql`
    query getAllLabelInTestPlan($testPlanId: Int!, $labelName: String, $labelTypes: [Int], $page: Int, $size: Int) {
        getAllLabel(testPlanId: $testPlanId, labelName: $labelName, page: $page, size: $size, labelTypes: $labelTypes) {
            labels {
                labelName
                labelId
                labelColor
            }
            pageInfo {
                currentPage
                pageSize
                totalElements
                totalPages
            }
        }
    }
`;
// Delete lable

export const DELETE_LABELS = gql`
    mutation deleteLabels($labelIds: [Int]) {
        deleteLabels(labelIds: $labelIds)
    }
`;

// Tạo Test Case

export const CREATE_TEST_CASE = gql`
    mutation createTestCase(
        $testCaseName: String
        $description: String
        $createdBy: String
        $priority: Int
        $expectResult: String
        $folderId: String
        $labels: [TestCaseLabelInput]
        $fileSeqs: String
    ) {
        createTestCase(
            input: {
                testCaseName: $testCaseName
                description: $description
                createdBy: $createdBy
                priority: $priority
                expectResult: $expectResult
                folderId: $folderId
                labels: $labels
                fileSeqs: $fileSeqs
            }
        ) {
            testCaseId
            testCaseName
            description
            createdAt
            updatedAt
            createdBy
            status
            priority
            expectResult
            folderId
            labels {
                labelId
            }
        }
    }
`;

// Update test case
export const UPDATE_TEST_CASE_BY_ID = gql`
    mutation updateTestCaseById(
        $testCaseId: ID
        $testCaseName: String
        $description: String
        $priority: Int
        $expectResult: String
        $labels: [TestCaseLabelInput]
        $fileSeqs: String
    ) {
        updateTestCaseById(
            input: {
                testCaseId: $testCaseId
                testCaseName: $testCaseName
                description: $description
                priority: $priority
                expectResult: $expectResult
                labels: $labels
                fileSeqs: $fileSeqs
            }
        ) {
            testCaseId
            testCaseName
            description
            createdAt
            updatedAt
            createdBy
            status
            priority
            expectResult
            folderId
        }
    }
`;

// Get danh sách thành viên

export const GET_ALL_MEMBER_CREATE_TEST_CASE = gql`
    query getAllMemberCreatedTestCase($folderId: ID!, $page: Int, $size: Int, $name: String) {
        getAllMemberCreatedTestCase(folderId: $folderId, page: $page, size: $size, name: $name) {
            pageInfo {
                currentPage
                pageSize
                totalElements
                totalPages
            }
            users {
                fullName
                userID
                userName
            }
        }
    }
`;

// Tạo 1 danh sách test case

export const CREATE_TEST_CASETS = gql`
    mutation createTestCases($folderId: ID!, $testCases: [CreateTestCaseDTO]!) {
        createTestCases(folderId: $folderId, testCases: $testCases)
    }
`;
