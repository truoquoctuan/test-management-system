import { gql } from '@apollo/client';

export const GET_TEST_PLANS = gql`
    query getAllTestPlan(
        $page: Int!
        $size: Int!
        $userId: ID!
        $sorted: String
        $status: Int!
        $testPlanName: String
        $createdBys: [ID]
    ) {
        getAllTestPlan(
            userId: $userId
            page: $page
            size: $size
            status: $status
            sorted: $sorted
            testPlanName: $testPlanName
            createdBys: $createdBys
        ) {
            pageInfo {
                currentPage
                pageSize
                totalElements
                totalPages
            }
            testPlans {
                createdAt
                createdBy
                endDate
                isPin
                startDate
                status
                testPlanId
                testPlanName
                updatedAt
                userInfo {
                    fullName
                    userID
                    userName
                }
            }
        }
    }
`;

export const GET_COUNT_TEST_PLANS = gql`
    query getCountTestPlans($userId: ID!, $status: Int!, $createdBys: [ID]) {
        getAllTestPlan(userId: $userId, status: $status, createdBys: $createdBys, page: 0, size: 10) {
            pageInfo {
                totalElements
            }
        }
    }
`;

// API  danh sách vị trí

export const GET_POSITION = gql`
    query getPosition($page: Int!, $size: Int!) {
        getPosition(page: $page, size: $size) {
            pageInfo {
                currentPage
                pageSize
                totalElements
                totalPages
            }
            positions {
                createdAt
                description
                positionId
                positionName
                updatedAt
            }
        }
    }
`;

// Api danh sách người tạo

export const GET_CREATER = gql`
    query getCreator($page: Int, $size: Int, $userId: ID!, $name: String) {
        getCreator(page: $page, size: $size, userId: $userId, name: $name) {
            pageInfo {
                pageSize
                currentPage
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

// Danh sách thành viên BZware

export const GET_ALL_USER_FORM_BZW = gql`
    query getAllUserFromBZW($name: String!, $userId: ID!) {
        getAllUserFromBZW(name: $name, userId: $userId) {
            fullName
            userID
            userName
        }
    }
`;
