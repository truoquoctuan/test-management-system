import { gql } from '@apollo/client';

// Danh sách thoong báo theo userId
export const GET_ALL_NOTIFY_BY_USERID = gql`
    query getAllNotifyByUserId($page: Int!, $size: Int!, $userId: ID!) {
        getAllNotifyByUserId(page: $page, size: $size, userId: $userId) {
            notifies {
                createdAt
                disable
                link
                notifyContent
                notifyId
                senderId
                status
                userId
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

// Đếm thông báo theo người dùng
export const COUNT_NOTIFY_BY_USERID = gql`
    query countNotifyByUserId($userId: ID!) {
        countNotifyByUserId(userId: $userId)
    }
`;

// Check thông báo theo userId
export const CHECKED_ALL_NOTIFY = gql`
    mutation checkedAllNotify($userId: ID!) {
        checkedAllNotify(userId: $userId)
    }
`;

// Gỡ 1 thông báo
export const DISABLE_NOTIFY = gql`
    mutation disableNotify($disable: Boolean!, $notifyId: ID!) {
        disableNotify(disable: $disable, notifyId: $notifyId)
    }
`;

// Gỡ tất cả thông báo

export const DISABLE_ALL_NOTIFY = gql`
    mutation disableAllNotify($userId: ID!) {
        disableAllNotify(userId: $userId)
    }
`;

// Chuyển thông báo thành đã đọc

export const MARK_AS_READ = gql`
    mutation markAsRead($notifyId: ID!, $status: Boolean!) {
        markAsRead(notifyId: $notifyId, status: $status)
    }
`;

// Chuyển tất cả  thông báo thành đã đọc
export const MARK_ALL_ASREAD = gql`
    mutation markAllRead($userId: ID!) {
        markAllRead(userId: $userId)
    }
`;

// Lấy dữu liệu cài đặt thông báo
export const GET_NOTIFY_SETTING = gql`
    query getNotifySetting($testPlanId: ID!, $userId: ID!) {
        getNotifySetting(testPlanId: $testPlanId, userId: $userId)
    }
`;

// Cài đặt thông báo
export const SET_NOTI_SETTING = gql`
    mutation setNotifySetting($testPlanId: ID!, $userId: ID!, $notifySetting: String) {
        setNotifySetting(testPlanId: $testPlanId, userId: $userId, notifySetting: $notifySetting)
    }
`;

// Lấy dữu liệu cài đặt email
export const GET_EMAIL_SETTING = gql`
    query getMailSetting($testPlanId: ID!, $userId: ID!) {
        getMailSetting(testPlanId: $testPlanId, userId: $userId)
    }
`;

// Cài đặt email
export const SET_EMAIL_SETTING = gql`
    mutation setNotifySetting($testPlanId: ID!, $userId: ID!, $mailSetting: String) {
        setMailSetting(testPlanId: $testPlanId, userId: $userId, mailSetting: $mailSetting)
    }
`;
