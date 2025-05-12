import axiosClient from './AxiosClient';
import axiosClientKeyCloak from './AxiosKeyCloak';

const workSpace = {
  getWorkspaceByName: (nameWorkspace) => {
    const url = `/workspace/getWorkspaceByName?name=${nameWorkspace}`;
    return axiosClient.get(url);
  },
  getInfoWorkspace: (idWorkSpace) => {
    const url = `/admin/realms/BZC/groups/${idWorkSpace}`;
    return axiosClientKeyCloak.get(url);
  },
  getListMember: (idWorkSpace, first, itemsPerPage) => {
    const url = `/admin/realms/BZC/groups/${idWorkSpace}/members?briefRepresentation=true&first=${first}&max=${itemsPerPage}`;
    return axiosClientKeyCloak.get(url);
  },
  saveAvatarMember: (uploadKey, entityNm, entityId) => {
    const url = `/file/save?uploadKey=${uploadKey}&entityNm=${entityNm}&entityId=${entityId}`;
    return axiosClient.post(url);
  },
  updateWorkspace: (workspaceId, data) => {
    const url = `/admin/realms/BZC/groups/${workspaceId}`;
    return axiosClientKeyCloak.put(url, data);
  },
};
export default workSpace;
