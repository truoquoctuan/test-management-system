import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../icons/Icon';
import { useGlobalContext } from '../../context/Context';
import AttachFile from '../../components/files/File';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { infoWorkSpace } = useGlobalContext();
  return (
    <div className="text-white flex flex-col h-[calc(100vh-64px)]">
      {isOpen && (
        <div className="tooltip  p-3 border-b border-slate-600 flex gap-3">
          <div className="flex gap-3 cursor-pointer items-center">
            <div className="w-[32px]">
              <AttachFile
                attachType="WorkspaceAvatar"
                entity="workspace"
                seq={infoWorkSpace?.workspaceId}
                register={null}
                viewMode={false}
                defaultImage={infoWorkSpace?.name}
                mode={'member' + infoWorkSpace?.workspaceId}
                className="h-[32px] w-[40px] rounded-lg bg-[#ececef] text-4xl"
              />
            </div>
            <p className="break-words w-[190px] truncate">{infoWorkSpace?.name}</p>
          </div>

          <span className="tooltip-text z-[300] text-[13px]">{infoWorkSpace?.name}</span>
        </div>
      )}

      {/* Menu Items */}

      <ul className="mt-4 space-y-2">
        <li>
          {isOpen && (
            <Link
              to="/"
              className={`flex items-center gap-4 px-4 py-2 cursor-pointer ${
                isActive('/') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex gap-3">
                <Icon name="Home" />
                <p className="font-normal text-sm text-white">Workspace</p>
              </div>
            </Link>
          )}
        </li>
        <li>
          {isOpen && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-4 px-4 py-2 cursor-pointer ${
                isActive('/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex gap-3">
                <Icon name="Dashboard" />
                <p className="font-normal text-sm text-white">Dashboard</p>
              </div>
            </Link>
          )}
        </li>
        <li>
          {isOpen && (
            <Link
              to="/accounts"
              className={`flex items-center gap-4 px-4 py-2 cursor-pointer ${
                isActive('/accounts') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex gap-3">
                <Icon name="User" />
                <p className="font-normal text-sm text-white">Members</p>
              </div>
            </Link>
          )}
        </li>
        <li>
          {isOpen && (
            <Link
              to="/services"
              className={`flex items-center gap-4 px-4 py-2 cursor-pointer ${
                isActive('/services') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex gap-3">
                <Icon name="Services" />
                <p className="font-normal text-sm text-white">Services</p>
              </div>
            </Link>
          )}
        </li>

        <li>
          {isOpen && (
            <Link
              to="/setting"
              className={`flex items-center gap-4 px-4 py-2 cursor-pointer ${
                isActive('/setting') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex gap-3">
                <Icon name="Setting" />
                <p className="font-normal text-sm text-white">Settings</p>
              </div>
            </Link>
          )}
        </li>
      </ul>
      <Link to="/help">
        {isOpen && (
          <div
            className={`flex items-center  gap-4 bottom-3 left-3 absolute cursor-pointer ${
              isActive('/help') ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <Icon name="HelpCircle" />
            <p>Help</p>
          </div>
        )}
      </Link>
    </div>
  );
};

export default Sidebar;
