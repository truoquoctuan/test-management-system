import { useEffect, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import { toast } from 'sonner';
import ModalComponent from '../common/Modal';
import axios from 'axios';
import Icon from '../../icons/Icon';
import AvatarFile from '../../assets/images/files/avatar_file.svg';
import Avatar from '../../assets/images/Avatar.svg';
import { useGlobalContext } from '../../context/Context';
import { GetListFiles } from '../../services/apis/File';
import ToastCustom from '../common/ToastCustom';
import { backEndUrl } from '../../services/apis/BackEndUrl';

const WorkSpaceAvatar = ({
  uploadKey,
  register,
  viewMode,
  mode,
  seq,
  setFiles,
  className,
  files,
  handleDrop,
  entity,
  image,
  setIsOpenAvartar,
  isOpenAvatar,
  userInfo,
  nameFile,
  setFileSeq,
}) => {
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);
  const fileSeq = files[files.length - 1]?.data ? files[files.length - 1]?.data : files[files.length - 1];
  const { useInfo, callBack } = useGlobalContext();

  // Lấy danh sách file
  useEffect(() => {
    if (seq) {
      const getFile = async () => {
        const data = await GetListFiles(entity, seq);
        setFiles(data.data.data);
        if (setFileSeq) {
          setFileSeq(data.data.data);
        }
      };
      getFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq, callBack, useInfo?.token]);

  const handleSave = async () => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      const imgDataUrl = canvas.toDataURL();
      const file = dataURLtoFile(imgDataUrl, nameFile.name);
      const validFiles = [file]; // Giả định file được chuẩn bị từ editor

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
            toast.custom((t) => (
              <ToastCustom status={true} title={'Profile picture updated successfully'} message="" t={t} />
            ));
          } catch (error) {
            toast.custom((t) => (
              <ToastCustom status={false} title={'Failed to upload profile picture'} message="" t={t} />
            ));
          }
        }
        setIsOpenAvartar(false);
      } catch (error) {
        toast.custom((t) => <ToastCustom status={false} title={'Error uploading file'} message="" t={t} />);
      }
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleClose = () => {
    setIsOpenAvartar(false);
  };

  return (
    <div>
      {viewMode ? (
        <div className={` gap-6 flex`}>
          {uploadKey !== '' && (
            <input type="hidden" className="w-full border" {...register('uploadKey', { value: uploadKey })} />
          )}

          <div>
            {fileSeq?.seq ? (
              <img
                src={`${backEndUrl}/file/displayImg/${fileSeq?.seq}`}
                alt="Workspace Avatar"
                className="h-[92px] w-[92px] rounded-xl border border-[#091E4224]"
                key={fileSeq?.seq}
              />
            ) : (
              <img src={AvatarFile} alt="User Avatar" className="avatar-image w-24 h-28 rounded-md" />
            )}
          </div>
          <div className="">
            <div className="mt-2 flex  gap-2">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-sm text-text-200">Avatar</p>
                <Dropzone onDrop={handleDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div className="flex gap-4">
                      <div {...getRootProps()} className="h-[36px] w-[126px] bg-[#F1F2F4]  rounded-[4px]  text-center">
                        <input {...getInputProps()} />
                        <p className="h-full translate-y-[20%] cursor-pointer font-medium text-sm text-text-200">
                          Choose file
                        </p>
                      </div>
                      <p className="font-normal text-sm text-[#626F86]">
                        {fileSeq ? fileSeq.fileNm : 'No file chosen.'}
                      </p>
                    </div>
                  )}
                </Dropzone>
                <p className="font-normal text-sm text-[#626F86]">The maximum file size allowed is 10MB.</p>
              </div>

              <ModalComponent isOpen={isOpenAvatar} setIsOpen={setIsOpenAvartar}>
                <div className="p-3">
                  <div className="flex justify-between border-b pb-4">
                    <p className="text-lg font-semibold">Avatar Customization</p>
                    <div onClick={() => handleClose()}>
                      <Icon name="close" className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <AvatarEditor
                      ref={(ref) => setEditor(ref)}
                      image={image}
                      width={250}
                      height={250}
                      border={50}
                      scale={scale}
                    />
                  </div>
                  <div className="mb-2 mt-2">
                    <label htmlFor="scale">Zoom:</label>
                    <input
                      type="range"
                      id="scale"
                      name="scale"
                      min="1"
                      max="2"
                      step="0.01"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                    />
                  </div>
                  <hr />
                  <div className="flex justify-center gap-2 py-2">
                    <div
                      onClick={() => handleClose()}
                      className="mt-2 w-[120px] cursor-pointer border border-primary-1 px-2 py-1.5 text-center font-semibold text-sm bg-[#ACD1E8] text-[#00568C] rounded-md"
                    >
                      Cancel
                    </div>
                    <div
                      onClick={handleSave}
                      className="mt-2 w-[120px] cursor-pointer font-semibold  border bg-[#00568C] text-white bg-primary-1 px-2 py-1.5 text-center text-sm rounded-md "
                    >
                      Confirm
                    </div>
                  </div>
                </div>
              </ModalComponent>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {fileSeq?.seq ? (
            <img
              src={`${backEndUrl}/file/displayImg/${fileSeq?.seq}`}
              alt="Use Avatar"
              className={`${className}`}
              key={mode}
            />
          ) : (
            <img src={Avatar} alt="U Avatar" className={`${className}`} />
          )}
        </div>
      )}
    </div>
  );
};

export default WorkSpaceAvatar;
