import { gql } from '@apollo/client';

// Get danh sách test case
export const GET_ALL_TEST_CASE = gql`
    query getAllTestCase(
        $folderId: ID!
        $sort: String
        $searchString: String
        $createdBys: [ID]
        $labelIds: [ID]
        $page: Int
        $size: Int
        $resultStatus: [Int]
    ) {
        getAllTestCase(
            folderId: $folderId
            page: $page
            size: $size
            createdBys: $createdBys
            labelIds: $labelIds
            searchString: $searchString
            sort: $sort
            resultStatus: $resultStatus
        ) {
            testCases {
                testCaseId
                testCaseName
                resultStatus
                status
                priority
                folderId
                createdBy
                createdAt
                updatedAt
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

export const CREATE_TEST_RESULT = gql`
    mutation createTestResult(
        $assignIds: String
        $content: String
        $status: Int
        $userId: String
        $testCaseId: String
        $fileSeqs: String
    ) {
        createTestResult(
            input: {
                assignIds: $assignIds
                content: $content
                status: $status
                testCaseId: $testCaseId
                userId: $userId
                fileSeqs: $fileSeqs
            }
        ) {
            assignIds
            content
            status
            testCaseId
            testResultId
            userId
        }
    }
`;

export const TEST_RESULTS = gql`
    query getTestResultById($id: ID!, $page: Int, $size: Int) {
        getTestResultById(id: $id, page: $page, size: $size) {
            testResults {
                testResultId
                testCaseId
                userId
                createFullName
                createUserName
                assignIds
                users {
                    email
                    fullName
                    userID
                    userName
                }
                content
                status
                createdAt
                updatedAt
                fileSeqs
                files {
                    fileSeq
                    fileSize
                    groupId
                    saveDt
                    saveNm
                    fileName
                    createdAt
                }
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

// Tạo comment

export const CREATE_COMMENT = gql`
    mutation createComment(
        $commentEntityId: ID!
        $commentType: Int!
        $userId: String
        $userListId: String
        $content: String
        $commentUpperId: ID
    ) {
        createComment(
            input: {
                commentEntityId: $commentEntityId
                commentType: $commentType
                userId: $userId
                userListId: $userListId
                content: $content
                commentUpperId: $commentUpperId
            }
        ) {
            commentId
            content
            createdAt
            updatedAt
            userId
            userListId
            userListIdInfo {
                userID
            }
            users {
                email
                fullName
                userID
                userName
            }
        }
    }
`;

// Danh sách comment

export const GEAT_ALL_COMMENT = gql`
    query getAllComment($commentEntityId: ID!, $page: Int!, $size: Int!, $commentType: Int!) {
        getAllComment(commentEntityId: $commentEntityId, commentType: $commentType, page: $page, size: $size) {
            comments {
                commentId
                content
                createdAt
                updatedAt
                totalReplies
                users {
                    userID
                    userName
                    fullName
                    email
                }
                userRepliedList {
                    userID
                    userName
                    fullName
                    email
                }
                userId
                userListId
                userListIdInfo {
                    fullName
                    userID
                    userName
                }
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

// Update coment

export const UPDATE_COMENT = gql`
    mutation updateComment(
        $commentId: ID
        $commentEntityId: ID!
        $commentType: Int!
        $userId: String
        $userListId: String
        $content: String
        $commentUpperId: ID
    ) {
        updateComment(
            input: {
                commentId: $commentId
                commentEntityId: $commentEntityId
                commentType: $commentType
                userId: $userId
                userListId: $userListId
                content: $content
                commentUpperId: $commentUpperId
            }
        ) {
            commentId
            content
            userListId
            createdAt
            updatedAt
        }
    }
`;

// Issuse

// Tạo / sửa nguyên nhân và giải pháp

export const SAVE_CAUSE_SOLUTION = gql`
    mutation saveCauseSolution($issuesId: ID, $cause: String, $solution: String) {
        saveCauseSolution(cause: $cause, issuesId: $issuesId, solution: $solution)
    }
`;

// Lấy nguyên nhân và giải pháp

export const GET_CAUSE_AND_SOLUTION = gql`
    query getCauseAndSolution($issuesId: ID) {
        getCauseAndSolution(issuesId: $issuesId) {
            cause
            solution
        }
    }
`;

// Lấy danh sách comment trả lời

export const GET_REPLIES = gql`
    query getReplies($parentId: ID!, $commentType: Int!, $page: Int!, $size: Int!) {
        getReplies(commentType: $commentType, page: $page, parentId: $parentId, size: $size) {
            commentDTO {
                commentId
            }
            pageInfo {
                currentPage
                pageSize
                totalElements
                totalPages
            }
            replies {
                commentDTO {
                    commentId
                    content
                    createdAt
                    updatedAt
                    totalReplies
                    userId
                    userListId
                    users {
                        userID
                        userName
                        fullName
                        email
                    }
                    userListIdInfo {
                        fullName
                        userID
                        userName
                    }
                    commentEntityId
                    commentUpperId
                    commentType
                }
            }
        }
    }
`;

// Danh sách all tetscase

export const GET_ALL_WITH_SEARCH = gql`
    query getAllWithSearch($testCaseId: ID, $testCaseName: String, $page: Int, $size: Int) {
        getAllWithSearch(testCaseId: $testCaseId, testCaseName: $testCaseName, page: $page, size: $size) {
            pageInfo {
                currentPage
                pageSize
                totalElements
                totalPages
            }
            testCases {
                testCaseId
                testCaseName
            }
        }
    }
`;

export const GET_ALL_LABLES_BY_TEST_PLAN_ID = gql`
    query getAllLabelsByTestPlanId($testPlanId: ID!) {
        getAllLabelsByTestPlanId(testPlanId: $testPlanId) {
            labelColor
            labelId
            labelName
            testPlanId
            labelType
        }
    }
`;
