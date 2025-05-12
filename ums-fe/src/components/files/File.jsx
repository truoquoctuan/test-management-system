import { forwardRef, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import WorkSpaceAvatar from './WorkSpaceAvatar';
import { getUploadKey } from '../../services/apis/File';
import { useGlobalContext } from '../../context/Context';
import ToastCustom from '../common/ToastCustom';
import { backEndUrl } from '../../services/apis/BackEndUrl';

const AttachFile = (props, ref) => {
  const [files, setFiles] = useState([]);
  const [uploadKey, setUploadKey] = useState('');
  const [isOpenAvatar, setIsOpenAvartar] = useState(false);
  const [image, setImage] = useState(null);
  const { userInfo } = useGlobalContext();

  const [nameFile, setNameFile] = useState(null);

  // Lấy uploadKey từ API GET /file
  const getUploadKeys = async () => {
    try {
      const response = await getUploadKey();
      setUploadKey(response.data.data.key);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={`Error fetching upload key`} message="" t={t} />);
    }
  };

  useEffect(() => {
    if (userInfo?.token && props.viewMode === true) {
      getUploadKeys(); // Lấy uploadKey khi component mount
    }
  }, [props.viewMode, userInfo?.token]);

  // Xử lý upload file
  const handleDrop = async (acceptedFiles) => {
    const maxFileSize = parseInt(props?.filters?.max_file_size) * 1024 * 1024; // Convert MB to bytes
    const allowedExtensions = props?.filters?.mime_types[0]?.extensions.split(',');

    const validFiles = acceptedFiles.filter((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        toast.custom((t) => <ToastCustom status={false} title={`Invalid file format.`} message="" t={t} />);
        return false;
      }
      if (file.size > maxFileSize) {
        toast.custom((t) => (
          <ToastCustom
            status={false}
            title={`Sorry, the file you are trying to upload is too big (Maximum size is ${props?.filters?.max_file_size} MB)`}
            message=""
            t={t}
          />
        ));

        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      toast.custom((t) => <ToastCustom status={false} title={'No valid files to upload'} message="" t={t} />);

      return;
    }
    if (props.attachType === 'WorkspaceAvatar') {
      try {
        for (const file of validFiles) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImage(e.target.result);
            setIsOpenAvartar(true);
            setNameFile(file);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        toast.custom((t) => <ToastCustom status={false} title={'Error uploading file'} message="" t={t} />);
      }
    } else {
      try {
        for (const file of validFiles) {
          const formData = new FormData();
          formData.append('name', file.name);
          formData.append('chunk', 0);
          formData.append('chunks', 0);
          formData.append('uploadKey', uploadKey);
          formData.append('file', file);

          try {
            const response = await axios.post(`${backEndUrl}/file`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo?.token}`,
              },
            });
            setFiles((prevFiles) => [...prevFiles, response.data]);
          } catch (error) {
            toast.custom((t) => <ToastCustom status={false} title={'Error uploading file'} message="" t={t} />);
          }
        }
      } catch (error) {
        toast.custom((t) => <ToastCustom status={false} title={'Error uploading file'} message="" t={t} />);
      }
    }
  };

  // Render components dựa trên attachType
  if (props.attachType === 'WorkspaceAvatar') {
    return (
      <WorkSpaceAvatar
        uploadKey={uploadKey}
        setUploadKey={setUploadKey}
        register={props.register}
        viewMode={props.viewMode}
        mode={props.mode}
        entity={props.entity}
        seq={props.seq}
        className={props.className}
        files={files}
        setFiles={setFiles}
        handleDrop={handleDrop}
        callBack={props?.callBack}
        defaultImage={props?.defaultImage}
        setIsOpenAvartar={setIsOpenAvartar}
        isOpenAvatar={isOpenAvatar}
        image={image}
        setFileSeq={props?.setFileSeq}
        userInfo={userInfo}
        nameFile={nameFile}
      />
    );
  }
};

export default forwardRef(AttachFile);
