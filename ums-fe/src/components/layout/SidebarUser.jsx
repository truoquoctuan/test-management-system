import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../icons/Icon';
import { useGlobalContext } from '../../context/Context';
import AttachFile from '../../components/files/File';

const SidebarUser = ({ isOpen }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { infoWorkSpace } = useGlobalContext();
  return (
    <div className="text-white flex flex-col h-[calc(100vh-64px)]">
      <div className="flex gap-4 p-3 border-b border-slate-600">
        <div className="w-[15%]">
          <AttachFile
            attachType="WorkspaceAvatar"
            entity="workspace"
            seq={infoWorkSpace?.workspaceId}
            register={null}
            viewMode={false}
            defaultImage={infoWorkSpace?.name}
            mode={'member' + infoWorkSpace?.workspaceId}
            className="h-[32px] w-[32px] rounded-lg bg-[#ececef] text-4xl"
          />
        </div>
        <div className="w-[90%]">
          <p>{infoWorkSpace?.name}</p>
        </div>
      </div>
      {/* Menu Items */}

      <ul className="mt-4 space-y-2">
        <li>
          {isOpen && (
            <Link
              to="/profile"
              className={`flex items-center gap-4 px-4 py-2 cursor-pointer ${
                isActive('/profile') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex gap-3">
                <Icon name="User" />
                <p className="font-normal text-sm text-white">Profile</p>
              </div>
            </Link>
          )}
        </li>
        <li>
          {isOpen && (
            <Link
              to="/security"
              className={`flex items-center gap-4 px-4 py-2 cursor-pointer ${
                isActive('/security') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex gap-3">
                <Icon name="Lock2" />
                <p className="font-normal text-sm text-white">Security</p>
              </div>
            </Link>
          )}
        </li>
        <li className="hidden">
          {isOpen && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-4 px-4 py-2 cursor-pointer ${
                isActive('/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex gap-3">
                <Icon name="Container" />
                <p className="font-normal text-sm text-white">Applications</p>
              </div>
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default SidebarUser;
