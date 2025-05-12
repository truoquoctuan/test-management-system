import axiosClient from './AxiosClient';
import axiosClientKeyCloak from './AxiosKeyCloak';

const account = {
  createUser: (data) => {
    const url = `/admin/realms/BZC/users`;
    return axiosClientKeyCloak.post(url, data);
  },
  getDetailUser: (username, email) => {
    const url = `/admin/realms/BZC/users?username=${username}&email=${email}`;
    return axiosClientKeyCloak.get(url);
  },
  createUsetExtended: (data) => {
    const url = `/userExtended/create`;
    return axiosClient.post(url, data);
  },
  getDetailUserInfo: (userID) => {
    const url = `/userExtended/${userID}`;
    return axiosClient.get(url);
  },
  getDetailUserInfoKeyCloak: (userID) => {
    const url = `/admin/realms/BZC/users/${userID}`;
    return axiosClientKeyCloak.get(url);
  },
  getUserDetail: (userID) => {
    const url = `/user/${userID}`;
    return axiosClient.get(url);
  },
  updateUser: (data) => {
    const url = `/userExtended/update`;
    return axiosClient.put(url, data);
  },
  updateUserKeycloak: (data, userID) => {
    const url = `/admin/realms/BZC/users/${userID}`;
    return axiosClientKeyCloak.put(url, data);
  },
  updateUserInfo: (data) => {
    const url = `/user/update-user`;
    return axiosClient.put(url, data);
  },
  updateUserKeycloakUser: (data) => {
    const url = `/realms/BZC/account/`;
    return axiosClientKeyCloak.post(url, data);
  },
  changeStatusMember: (userID, status) => {
    const url = `/user/${userID}/update-status/${status}`;
    return axiosClient.put(url);
  },
  getListmember: (workspaceId, page, size, search, enabled, createdTimestamp, currentSort) => {
    const url = `/user/groups/${workspaceId}/members?userName=${search}&page=${page}&size=${size}${createdTimestamp && !currentSort ? `&orders=${createdTimestamp}` : ''}${!createdTimestamp && currentSort ? currentSort : ''}${enabled !== undefined ? `&enabled=${enabled}` : `&enabled=${-1}`}`;
    return axiosClient.get(url);
  },
  updatePassWord: (userId, data) => {
    const url = `/admin/realms/BZC/users/${userId}/reset-password`;
    return axiosClientKeyCloak.put(url, data);
  },
  getListmemberWorkSpace: (workspaceId) => {
    const url = `user/groups/${workspaceId}/members?&page=1&size=10&enabled=-1`;
    return axiosClient.get(url);
  },
  createActivity: (data) => {
    const url = `/user-activity/add-activity`;
    return axiosClient.post(url, data);
  },
  getDetailActivityUser: (userId) => {
    const url = `/user-activity/${userId}?page=0&size=100`;
    return axiosClient.get(url);
  },
  getDetailUserCode: (userCode) => {
    const url = `/admin/realms/BZC/users?userCode=${userCode}`;
    return axiosClient.get(url);
  },
  getListMemberNotJoined: (workspaceId, page, size, search) => {
    const url = `/user/users-not-in-group/${workspaceId}?searchName=${search}&page=${page}&size=${size}`;
    return axiosClient.get(url);
  },
  addMember: (data) => {
    const url = `/workspace/add-members`;
    return axiosClient.post(url, data);
  },
  deleteMemberGroup: (data) => {
    const url = `/workspace/remove-member`;
    return axiosClient.post(url,data);
  },
};
export default account;
