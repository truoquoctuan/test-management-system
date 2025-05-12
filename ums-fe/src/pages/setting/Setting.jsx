import React, { useEffect, useState } from 'react';
import AttachFile from '../../components/files/File';
import { useForm } from 'react-hook-form';
import { useGlobalContext } from '../../context/Context';
import workSpace from '../../services/apis/WorkSpace';
import { toast } from 'sonner';
import ToastCustom from '../../components/common/ToastCustom';
const Setting = () => {
  const { register, handleSubmit, reset } = useForm();
  const { infoWorkSpace, setInfoWorkSpace, setCallback, callBack } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reset(infoWorkSpace);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoWorkSpace]);
  const onSubmit = async (data) => {
    try {
      const dataWorkSpace = {
        name: data.name,
        attributes: {},
      };
      await workSpace.saveAvatarMember(data.uploadKey, 'workspace', data.workspaceId);
      await workSpace.updateWorkspace(data.workspaceId, dataWorkSpace);

      setInfoWorkSpace((prev) => ({
        ...prev,
        name: data.name,
      }));
      setCallback(!callBack);
      toast.custom((t) => <ToastCustom status={true} title="Workspace update successful" message="" t={t} />);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title="An error occurred." message="" t={t} />);
    }
  };

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="w-[1248px] m-auto p-6 flex flex-col gap-6 animate__animated animate__fadeIn">
      <div>
        <p className="text-text-200 font-bold text-2xl">Settings</p>
        <p className="font-normal text-sm text-text-100 ">Customize your workspace with a new name and avatar.</p>
      </div>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <AttachFile
            attachType="WorkspaceAvatar"
            entity={'workspace'}
            seq={infoWorkSpace?.workspaceId}
            register={register}
            setFileSeq={null}
            viewMode={true}
            mode="member"
            className="h-8 w-8 rounded-full object-cover"
            filters={{
              max_file_size: '10mb',
              mime_types: [
                {
                  title: 'Tệp đã được nhận: ',
                  extensions: 'jpg,png,jpeg,svg,webp',
                },
              ],
            }}
          />
        </div>
        <div>
          <p className="font-medium text-sm text-text-200 mb-2">Workspace name</p>
          <input
            {...register('name', { required: true })}
            className="w-[765px] border border-[#091E424F] rounded-md h-[40px] focus:outline-none px-4 font-normal text-sm "
          />
          <p className="font-normal text-xs text-text-100 ">Your workspace's unique identity. Maximum 50 characters.</p>
          <button className="bg-primary-200 w-[139px] h-[40px] rounded-[4px] text-white mt-6 font-medium text-base">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setting;
