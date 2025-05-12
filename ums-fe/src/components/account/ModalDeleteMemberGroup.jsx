import React from 'react';
import ModalComponent from '../common/Modal';
import account from '../../services/apis/Account';
import { toast } from 'sonner';
import ToastCustom from '../common/ToastCustom';

const ModalDeleteMemberGroup = ({
  setIsOpenInfoUser,
  isOpenDeleteMemberGroup,
  setIsOpenDeleteMemberGroup,
  infoMember,
  setCallback,
  callBack, 
  workspaceId,
}) => {
  const handleLeaverMember = async () => {
    const data= {
      groupId:workspaceId,
      userId:infoMember.userId
    }
    try {
      await account.deleteMemberGroup(data);

      toast.custom((t) => <ToastCustom status={true} title={`Leaver Member successfully `} message="" t={t} />);
      setIsOpenInfoUser(false);
      setIsOpenDeleteMemberGroup(false);
      setCallback(!callBack);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={error?.message} message="" t={t} />);
    }
  };

  return (
    <div>
      <ModalComponent isOpen={isOpenDeleteMemberGroup} setIsOpen={setIsOpenDeleteMemberGroup}>
        <div className="w-[480px] p-6 flex flex-col gap-3">
          <div>
            <div className="bg-[#FFF7D6] w-9 h-9 rounded-full flex items-center justify-center">
              <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.9998 8.00023V12.0002M11.9998 16.0002H12.0098M10.6151 2.89195L2.39019 17.0986C1.93398 17.8866 1.70588 18.2806 1.73959 18.6039C1.769 18.886 1.91677 19.1423 2.14613 19.309C2.40908 19.5002 2.86435 19.5002 3.77487 19.5002H20.2246C21.1352 19.5002 21.5904 19.5002 21.8534 19.309C22.0827 19.1423 22.2305 18.886 22.2599 18.6039C22.2936 18.2806 22.0655 17.8866 21.6093 17.0986L13.3844 2.89195C12.9299 2.10679 12.7026 1.71421 12.4061 1.58235C12.1474 1.46734 11.8521 1.46734 11.5935 1.58235C11.2969 1.71421 11.0696 2.10679 10.6151 2.89195Z"
                  stroke="#7F5F01"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-text-200 font-semibold text-lg">Leaver Member</p>
            <p className="text-sm font-normal text-text-100">Remove member from workspace</p>
          </div>
          <div className="flex gap-5 justify-end items-center">
            <div className="cursor-pointer" onClick={() => setIsOpenDeleteMemberGroup(false)}>
              <p className="text-sm">Cancel</p>
            </div>
            <div className="cursor-pointer">
              <p className={` bg-[#C9372C]  rounded text-sm text-white p-2`} onClick={() => handleLeaverMember()}>
                Leaver Member
              </p>
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default ModalDeleteMemberGroup;
