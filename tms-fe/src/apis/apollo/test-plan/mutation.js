import { gql } from '@apollo/client';

export const CREATE_TEST_PLAN = gql`
    mutation createTestPlan(
        $createdBy: ID!
        $testPlanName: String!
        $status: Int
        $description: String!
        $startDate: String
        $endDate: String
        $uploadKey: String
        $members: [MemberInput]
    ) {
        createTestPlan(
            testPlan: {
                createdBy: $createdBy
                testPlanName: $testPlanName
                description: $description
                status: $status
                startDate: $startDate
                endDate: $endDate
                uploadKey: $uploadKey
                members: $members
            }
        ) {
            createdAt
            createdBy
            description
            endDate
            startDate
            status
            testPlanId
            testPlanName
            updatedAt
        }
    }
`;

export const UPDATE_TEST_PLANS_STT = gql`
    mutation disableTestPlans($testPlans: [TestPlanInput!]!) {
        disableTestPlans(testPlans: $testPlans) {
            status
            testPlanId
        }
    }
`;

export const UPDATE_TEST_PLAN_PIN = gql`
    mutation MyMutation($userId: ID!, $testPlanId: ID!, $isPin: Boolean!) {
        pinTestPlan(userId: $userId, testPlanId: $testPlanId, isPin: $isPin) {
            testPlanId
            isPin
        }
    }
`;

export const UPDATE_INFO_TEST_PLAN = gql`
    mutation updateInfoTestPlan(
        $description: String
        $endDate: String
        $startDate: String
        $status: Int
        $testPlanId: ID
        $testPlanName: String
        $uploadKey: String
    ) {
        updateInfoTestPlan(
            testPlan: {
                description: $description
                endDate: $endDate
                startDate: $startDate
                status: $status
                testPlanId: $testPlanId
                testPlanName: $testPlanName
                uploadKey: $uploadKey
            }
        ) {
            createdAt
            createdBy
            description
            endDate
            startDate
            status
            testPlanId
            testPlanName
            updatedAt
        }
    }
`;
// Danh sách thành viên
export const LIST_MEMBER_TEST_PLAND = gql`
    query getMembersByTestPlanId($page: Int!, $size: Int!, $testPlanId: ID!, $name: String) {
        getMembersByTestPlanId(page: $page, size: $size, testPlanId: $testPlanId, name: $name, sorted: "user_id+asc") {
            members {
                addBy
                memberId
                positions {
                    positionId
                    positionName
                }
                roleTestPlan
                userId
                userInfo {
                    userID
                    fullName
                    userName
                }
            }
            pageInfo {
                currentPage
                pageSize
                totalPages
                totalElements
            }
        }
    }
`;
export const LIST_MEMBER_TEST_PLAND_Edit = gql`
    query getMembersByTestPlanIdInEdit($testPlanId: ID!) {
        getMembersByTestPlanIdInEdit(testPlanId: $testPlanId) {
            members {
                addBy
                memberId
                positions {
                    positionId
                    positionName
                }
                roleTestPlan
                userId
                userInfo {
                    userID
                    fullName
                    userName
                }
            }
            pageInfo {
                currentPage
                pageSize
                totalPages
                totalElements
            }
        }
    }
`;
// Update danh sách thành viên test plan
export const SAVE_MEMBER_TEST_PLAN = gql`
    mutation saveMemberTestPlan($testPlanId: ID!, $members: [MemberInput]) {
        saveMemberTestPlan(testPlanId: $testPlanId, members: $members) {
            addBy
            addedAt
            memberId
            roleTestPlan
            userId
            positions {
                positionId
            }
        }
    }
`;

// Xóa thành viên

export const DELETE_MEMBERS = gql`
    mutation DeleteMembers($memberIds: [ID!]!) {
        deleteMembersOnTestPlan(memberIds: $memberIds)
    }
`;
