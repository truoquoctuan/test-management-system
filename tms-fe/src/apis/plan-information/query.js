import { gql } from '@apollo/client';

export const GET_TEST_PLAN_BY_ID = gql`
    query getTestPlanById($testPlanId: ID!) {
        getTestPlanById(testPlanId: $testPlanId) {
            createdAt
            createdBy
            description
            endDate
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
`;

export const GET_MEMBERS_BY_TEST_PLAN_ID = gql`
    query getMembersByTestPlanId($testPlanId: ID!, $page: Int!, $size: Int!, $name: String, $sorted: String) {
        getMembersByTestPlanId(testPlanId: $testPlanId, page: $page, size: $size, name: $name, sorted: $sorted) {
            members {
                memberId
                addedAt
                positions {
                    positionName
                    positionId
                }
                adderInfo {
                    fullName
                    userID
                    userName
                }
                roleTestPlan
                testPlanId
                userId
                userInfo {
                    fullName
                    userID
                    userName
                }
                addBy
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
