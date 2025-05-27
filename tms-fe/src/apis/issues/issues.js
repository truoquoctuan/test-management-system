import { gql } from '@apollo/client';

export const GET_ALL_ISSUES_IN_TEST_PLAN = gql`
    query getAllIssuesInTestPlan(
        $testPlanId: ID!
        $issuesIds: [ID]
        $issuesName: String
        $assignIds: [ID]
        $testCaseIds: [ID]
        $dueDate: String
        $prioritys: [Int]
        $tags: [ID]
        $status: [Int]
        $sorted: String
        $page: Int
        $size: Int
        $exactFilterMatch: Boolean
    ) {
        getAllIssuesInTestPlan(
            page: $page
            size: $size
            sorted: $sorted
            input: {
                testPlanId: $testPlanId
                assignIds: $assignIds
                dueDate: $dueDate
                issuesIds: $issuesIds
                issuesName: $issuesName
                priorities: $prioritys
                status: $status
                testCaseIds: $testCaseIds
                tags: $tags
                exactFilterMatch: $exactFilterMatch
            }
        ) {
            issues {
                createdAt
                description
                endDate
                issuesId
                issuesName
                note
                priority
                scope
                startDate
                status
                updatedAt
                users {
                    email
                    fullName
                    userID
                    userName
                }
                testCases {
                    createdAt
                    createdBy
                    priority
                    resultStatus
                    status
                    testCaseId
                    testCaseName
                    updatedAt
                }
                testPlan {
                    testPlanId
                }
                labelsList {
                    labelColor
                    labelId
                    labelName
                    labelType
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

export const CREATE_ISSUE = gql`
    mutation createIssues(
        $assignIds: String
        $description: String
        $endDate: String
        $issuesName: String
        $note: String
        $priority: Int
        $scope: String
        $startDate: String
        $status: Int
        $createdBy: ID
        $testPlanId: ID
        $uploadKey: String
        $testCaseSelection: String
        $labels: String
    ) {
        createIssues(
            input: {
                assignIds: $assignIds
                description: $description
                endDate: $endDate
                issuesName: $issuesName
                note: $note
                priority: $priority
                scope: $scope
                startDate: $startDate
                status: $status
                createdBy: $createdBy
                testPlanId: $testPlanId
                uploadKey: $uploadKey
                testCaseSelection: $testCaseSelection
                labels: $labels
            }
        )
    }
`;
// Định nghĩa mutation sử dụng kiểu input
export const MODIFY_ISSUE = gql`
    mutation modifyIssues(
        $issuesId: ID!
        $issuesName: String
        $status: Int
        $scope: String
        $description: String
        $note: String
        $uploadKey: String
    ) {
        modifyIssues(
            input: {
                description: $description
                issuesId: $issuesId
                issuesName: $issuesName
                note: $note
                scope: $scope
                status: $status
                uploadKey: $uploadKey
            }
        )
    }
`;

// Update assign to

export const MODIFY_ASSIGNS = gql`
    mutation modifyAssigns($issuesId: ID!, $assignIds: String, $userId: ID!) {
        modifyAssigns(issuesId: $issuesId, assignIds: $assignIds, userId: $userId)
    }
`;

// Update Link to test case

export const MODIFY_TEST_CASES = gql`
    mutation modifyTestCases($issuesId: ID!, $testCaseIds: String) {
        modifyTestCases(issuesId: $issuesId, testCaseIds: $testCaseIds)
    }
`;
// update label
export const MODIFY_LABEL = gql`
    mutation modifyLabelInIssues($issuesId: ID!, $labelIds: String) {
        modifyLabelInIssues(issuesId: $issuesId, labelIds: $labelIds)
    }
`;
// update Prority
export const MODIFY_PRORITY = gql`
    mutation modifyPriority($issuesId: ID!, $priority: Int) {
        modifyPriority(priority: $priority, issuesId: $issuesId)
    }
`;
// Update Time
export const MODIFI_START_DATE = gql`
    mutation modifyStartDate($startDate: String, $issuesId: ID!) {
        modifyStartDate(issuesId: $issuesId, startDate: $startDate)
    }
`;

export const MODIFI_END_DATE = gql`
    mutation modifyEndDate($endDate: String, $issuesId: ID!) {
        modifyEndDate(issuesId: $issuesId, endDate: $endDate)
    }
`;

export const GET_ISSUES_BY_ID = gql`
    query GetIssuesById($issuesId: ID!) {
        getIssuesById(issuesId: $issuesId) {
            createdAt
            description
            endDate
            issuesId
            issuesName
            note
            priority
            scope
            startDate
            status
            testCases {
                createdAt
                createdBy
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
            }
            testPlan {
                testPlanId
            }
            updatedAt
            createdBy
            users {
                email
                fullName
                userID
                userName
            }
            creator {
                email
                fullName
                userID
                userName
            }
            labelsList {
                labelColor
                labelId
                labelName
                labelType
            }
        }
    }
`;
export const GET_ALL_TEST_CASES_BY_TEST_PLAN_ID_WITH_SEARCH = gql`
    query GetAllTestCaseByTestPlanIdWithSearch(
        $testCaseId: ID
        $testCaseName: String
        $testPlanId: ID!
        $page: Int
        $size: Int
    ) {
        getAllTestCaseByTestPlanIdWithSearch(
            testCaseId: $testCaseId
            testCaseName: $testCaseName
            testPlanId: $testPlanId
            page: $page
            size: $size
        ) {
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

export const REMOVE_ISSUES = gql`
    mutation removeIssues($issuesIds: [ID!]) {
        removeIssues(issuesIds: $issuesIds)
    }
`;
export const UPDATE_ISSUES_STATUS = gql`
    mutation updateIssuesStatus($issuesId: ID!, $status: Int!, $userId: ID!) {
        updateIssuesStatus(issuesId: $issuesId, status: $status, userId: $userId)
    }
`;
export const GET_ALL_LABELS_BY_TEST_PLAN_ID = gql`
    query GetAllLabelsByTestPlanId($testPlanId: ID!) {
        getAllLabelsByTestPlanId(testPlanId: $testPlanId) {
            labelColor
            labelId
            labelName
            testPlanId
            labelType
        }
    }
`;
export const CREATE_LABEL = gql`
    mutation CreateLabel($input: CreateLabelInput!) {
        createLabel(input: $input) {
            labelColor
            labelId
            labelName
            testPlanId
            labelType
        }
    }
`;
export const UPDATE_LABEL = gql`
    mutation UpdateLabel($input: LabelInput!, $labelId: ID!) {
        updateLabel(input: $input, labelId: $labelId) {
            labelColor
            labelId
            labelName
            testPlanId
            labelType
        }
    }
`;
export const REMOVE_LABEL = gql`
    mutation RemoveLabel($labelIds: [ID!]!) {
        removeLabel(labelIds: $labelIds)
    }
`;
