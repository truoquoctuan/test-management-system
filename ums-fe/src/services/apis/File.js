import axiosClient from './AxiosClient';

export const getUploadKey = () => {
  const url = `/file/key`;
  return axiosClient.get(url);
};
export const GetUploadKeyBg = () => {
  const url = `/background/key`;
  return axiosClient.get(url);
};
export const DisplayImg = (fileSeq) => {
  const url = `/file/displayImg/key/${fileSeq}`;
  return axiosClient.get(url);
};
export const getImage = (fileSeq) => {
  const url = `/file/${fileSeq}`;
  return axiosClient.get(url);
};

export const DeleteFile = (fileSeq) => {
  const url = `/file/${fileSeq}`;
  return axiosClient.delete(url);
};

export const GetListFiles = (entity, seq) => {
  const url = `/file/list/${entity}-${seq}`;
  return axiosClient.get(url);
};
export const GetListFilesBackground = (entity, seq) => {
  const url = `/background/listByGroupId?groupId=${entity}-${seq}`;
  return axiosClient.get(url);
};
