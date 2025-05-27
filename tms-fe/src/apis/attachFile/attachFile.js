import { gql } from '@apollo/client';

export const GENERATE_KEY = gql`
    query generateKey {
        generateKey {
            key
            message
        }
    }
`;

export const GET_LIST_FILE_BY_GROUP_ID = gql`
    query getListFileByGroupId($id: String!) {
        getListFileByGroupId(id: $id) {
            fileSeq
            fileName
            groupId
            fileSize
            saveNm
            saveDt
        }
    }
`;

export const DISPLAY_IMG = gql`
    query displayImg($seq: ID!) {
        displayImg(seq: $seq) {
            fileSeq
            fileName
            contentType
            base64Image
        }
    }
`;

export const DELETE_FILE_BY_SEQ = gql`
    mutation deleteFileBySeq($id: ID!) {
        deleteFileBySeq(id: $id) {
            isSuccess
            message
        }
    }
`;

export const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload!, $uploadKey: String!, $name: String!, $chunk: Int!, $chunks: Int!) {
        uploadFile(chunk: $chunk, chunks: $chunks, name: $name, uploadKey: $uploadKey, file: $file) {
            fileName
            fileSeq
            fileSize
            groupId
            saveDt
            saveNm
        }
    }
`;

// API avatar thành viên

export const GET_USER_AVATAR = gql`
    query getUserAvatar($groupId: String!) {
        getUserAvatar(groupId: $groupId)
    }
`;

// Dowload file

export const DOWLOAD_FILE = gql`
    mutation downloadFile($id: ID!) {
        downloadFile(id: $id) {
            contentDisposition
            contentType
            data
        }
    }
`;

export const GENERATE_CSV = gql`
    query generateCSV($testPlanId: ID!, $name: String!, $uploadKey: String!) {
        generateCSV(chunk: 0, chunks: 0, name: $name, testPlanId: $testPlanId, uploadKey: $uploadKey) {
            fileName
            fileSeq
            fileSize
            groupId
            saveDt
            saveNm
        }
    }
`;
export const GENERATE_CSV_ISSUES = gql`
    query generateCSVIssues($testPlanId: ID!, $name: String!, $uploadKey: String!) {
        generateCSVIssues(chunk: 0, chunks: 0, name: $name, uploadKey: $uploadKey, testPlanId: $testPlanId) {
            fileName
            fileSeq
            fileSize
            groupId
            saveDt
            saveNm
        }
    }
`;
