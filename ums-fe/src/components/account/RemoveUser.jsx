import React from 'react';
import ModalComponent from '../common/Modal';

const RemoveUser = ({ isRemoveUser, setIsRemoveUser }) => {
  const handleRemove = () => {};
  return (
    <div>
      <ModalComponent isOpen={isRemoveUser} setIsOpen={setIsRemoveUser}>
        <div className="w-[480px] p-6 flex flex-col gap-3">
          <div>
            <div className="bg-[#FFECEB] w-9 h-9 rounded-full flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 15V11M11 7H11.01M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
                  stroke="#AE2E24"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-text-200 font-semibold text-lg">Remove Member</p>
            <p className="text-sm font-normal text-text-100">
              Are you sure you want to remove this member? This action is permanent and cannot be undone.{' '}
            </p>
          </div>
          <div className="flex gap-5 mt-4 justify-end items-center">
            <div className="cursor-pointer" onClick={() => setIsRemoveUser(false)}>
              <p className="text-sm">Cancel</p>
            </div>
            <div className="cursor-pointer" onClick={() => handleRemove()}>
              <p className="bg-[#C9372C] rounded text-sm text-white p-2">Remove</p>
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default RemoveUser;
