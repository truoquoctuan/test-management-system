import { gql } from '@apollo/client';

export const GET_ALL_FOLDERS_RUNNING_BY_TES_PLAN_ID = gql`
    query getAllFoldersRunningByTesPlanId(
        $testPlanId: ID!
        $searchString: String
        $sort: String!
        $page: Int!
        $size: Int!
    ) {
        getAllFoldersRunningByTesPlanId(
            testPlanId: $testPlanId
            searchString: $searchString
            sort: $sort
            page: $page
            size: $size
        ) {
            folders {
                createdAt
                createdBy
                description
                folderId
                folderName
                sortOrder
                status
                updatedAt
                upperId
                testPlan {
                    testPlanId
                }
            }
            pageInfo {
                totalPages
                totalElements
                currentPage
                pageSize
            }
        }
    }
`;

// GET danh sách thu mục con
export const GET_ALL_CHILD_FOLDERS_BY_UPPERID = gql`
    query getAllChildFoldersByUpperId($upperIds: [ID!]) {
        getAllChildFoldersByUpperId(upperIds: $upperIds) {
            folderId
            folderName
            description
            createdAt
            updatedAt
            createdBy
            sortOrder
            upperId
            status
            fullName
            userName
        }
    }
`;
