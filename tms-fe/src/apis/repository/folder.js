import { gql } from '@apollo/client';

// GET danh sách thư mục cha
export const GET_ALL_FOLDERS_BY_TESPLANDID = gql`
    query getAllFoldersByTesPlanId($testPlanId: ID!, $searchString: String, $sort: String!, $page: Int!, $size: Int!) {
        getAllFoldersByTesPlanId(
            testPlanId: $testPlanId
            searchString: $searchString
            sort: $sort
            page: $page
            size: $size
        ) {
            folders {
                folderId
                folderName
                sortOrder
                upperId
                status
                testPlanId
                hasTestCase
                testPlanId
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
            hasTestCase
            fullName
            userName
        }
    }
`;
// Tạo thư mục
export const CREATE_FOLDER = gql`
    mutation createFolder(
        $testPlanId: String!
        $upperId: Int!
        $folderName: String!
        $description: String!
        $createdBy: String!
    ) {
        createFolder(
            input: {
                testPlanId: $testPlanId
                upperId: $upperId
                folderName: $folderName
                description: $description
                createdBy: $createdBy
            }
        ) {
            folderId
            folderName
            description
            createdAt
            updatedAt
            createdBy
            sortOrder
            upperId
            status
        }
    }
`;
// GET chi tiết thư mục
export const GET_FOLDER_BY_ID = gql`
    query getFolderById($id: ID!) {
        getFolderById(id: $id) {
            folderId
            folderName
            description
            createdAt
            updatedAt
            createdBy
            sortOrder
            upperId
            fullName
            userName
        }
    }
`;

// Sửa thư mục
export const UPDATE_FOLDER_BY_ID = gql`
    mutation updateFolderById($folderId: ID!, $folderName: String!, $description: String!) {
        updateFolderById(input: { folderId: $folderId, folderName: $folderName, description: $description }) {
            folderId
            folderName
            description
        }
    }
`;
// Xóa thư mục

export const DELETE_FOLDER_BY_ID = gql`
    mutation deleteFolderById($id: ID!) {
        deleteFolderById(id: $id) {
            isSuccess
            message
        }
    }
`;

// Run folder

export const RUN_FOLDER = gql`
    mutation runFolder($ids: [ID!]!, $status: Int!) {
        runFolder(ids: $ids, status: $status) {
            isSuccess
            message
        }
    }
`;
// Check role test pland

export const GET_ROLE_IN_TESST_PLAN = gql`
    query getRoleInTestPlan($testPlanId: ID!, $userId: ID!) {
        getRoleInTestPlan(testPlanId: $testPlanId, userId: $userId)
    }
`;
