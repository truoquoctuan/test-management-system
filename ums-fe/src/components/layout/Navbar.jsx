import React, { useRef, useState } from 'react';
import Icon from '../../icons/Icon';
import Logo from '../../assets/images/logoBZC.svg';
import keycloak from '../../services/keycloak/Keycloak';
import { useGlobalContext } from '../../context/Context';
import AttachFile from '../../components/files/File';

import LogoBZC from '../../assets/images/logo/LogoBZC.svg';
import LogoBZT from '../../assets/images/logo/LogoBZT.svg';
import LogoBZQ from '../../assets/images/logo/LogoBZQ.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useOutsideClick from '../../hooks/useOutsideClick';
const Navbar = ({ toggleSidebar }) => {
  const { userInfo, tokenInformation, checkPermissions } = useGlobalContext();
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenApp, setIsOpenApp] = useState(false);
  const refProfile = useRef();
  const refApp = useRef();

  const navigate = useNavigate();

  const hendleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };
  useOutsideClick(refProfile, setIsOpenProfile);
  useOutsideClick(refApp, setIsOpenApp);

  const location = useLocation();

  return (
    <div className="bg-[#1C2B41]  flex justify-between items-center px-6  shadow-md z-10 relative">
      <div className="flex items-center h-16 gap-6 ">
        <button onClick={toggleSidebar} className="text-gray-800 text-xl  focus:outline-none">
          <Icon name="Menu" className="cursor-pointer pt-1.5 stroke-white" />
        </button>

        <div
          onClick={() => {
            checkPermissions ? navigate('/') : navigate('/profile');
          }}
          className="cursor-pointer"
        >
          <h1 className="text-base font-semibold text-white flex gap-2 items-center">
            {/* <img src={Logo} alt="" /> */}
            Trang chủ
          </h1>
        </div>
        {checkPermissions && (
          <div className="bg-[#C8E1F91A] rounded-md flex gap-2 justify-center px-3">
            <Icon name="IconAdmin" />
            <p className="font-medium text-sm text-white  py-2 ">Admin</p>
          </div>
        )}
      </div>
      <div className="flex gap-6 items-center">
        <div ref={refApp}>
          <div onClick={() => setIsOpenApp(!isOpenApp)} className="cursor-pointer ">
            <Icon name="Grid01" />
          </div>
          {/* {isOpenApp && (
            <div className="w-[300px] border rounded-md bg-white absolute right-20 top-14 ">
              <div className="p-4">
                <p className="text-[#626F86] font-medium text-xs">YOUR APPS</p>
              </div>
              <hr />
              <div className="px-4 py-2">
                <Link to="https://bzw.bzcom.vn/">
                  <div className="flex gap-3 py-2 items-center hover:bg-[#A1BDD914]">
                    <img src={LogoBZC} alt="Logo Bzcom" />
                    <p className="font-normal text-sm text-text-200">BZWare</p>
                  </div>
                </Link>
                <Link to="https://bzt.bzcom.vn/">
                  <div className="flex gap-3 py-2 items-center hover:bg-[#A1BDD914]">
                    <img src={LogoBZT} alt="Logo Bzcom" />
                    <p className="font-normal text-sm text-text-200">BZTalk</p>
                  </div>
                </Link>
                <Link to="https://bzq.bzcom.vn/">
                  <div className="flex gap-3 py-2 items-center hover:bg-[#A1BDD914]">
                    <img src={LogoBZQ} alt="Logo Bzcom" />
                    <p className="font-normal text-sm text-text-200">BZQuality</p>
                  </div>
                </Link>
              </div>
            </div>
          )} */}
        </div>
        <div className="w-10 h-10">
          <div onClick={() => setIsOpenProfile(!isOpenProfile)} className=" cursor-pointer" ref={refProfile}>
            <AttachFile
              attachType="WorkspaceAvatar"
              entity="user"
              seq={userInfo?.subject}
              register={null}
              viewMode={false}
              defaultImage={userInfo?.subject}
              mode={'member' + userInfo?.subject}
              className="w-8 h-8 rounded-lg border-[#091E4224] border"
            />
            {isOpenProfile && (
              <div className="w-[300px] border rounded-md bg-white absolute right-4 top-14 p-4">
                <div className="flex gap-4 pb-4">
                  <div className="w-10 h-10">
                    <AttachFile
                      attachType="WorkspaceAvatar"
                      entity="user"
                      seq={tokenInformation?.sub}
                      register={null}
                      viewMode={false}
                      defaultImage={tokenInformation?.sub}
                      mode={'member' + tokenInformation?.sub}
                      className="w-8 h-8 rounded-lg border-[#091E4224] border"
                    />
                  </div>

                  <div>
                    <p className="text-text-200 text-sm font-bold">
                      {tokenInformation?.family_name} {tokenInformation?.given_name}
                    </p>
                    <p className="text-text-100 text-xs font-normal ">@{tokenInformation?.preferred_username}</p>
                  </div>
                </div>
                <hr />
                {checkPermissions && (
                  <>
                    {location.pathname === '/profile' ? (
                      <div></div>
                    ) : (
                      <Link to="/profile">
                        <div className="flex gap-3 py-2 hover:bg-[#A1BDD914] hover:border-l-2 hover:border-primary-200 px-2">
                          <Icon name="User2" />
                          <p className="font-normal text-sm text-text-200">Account Settings</p>
                        </div>
                      </Link>
                    )}
                  </>
                )}

                <div
                  className="flex gap-3 py-2 hover:bg-[#A1BDD914] hover:border-l-2 hover:border-primary-200 px-2"
                  onClick={() => hendleLogout()}
                >
                  <Icon name="Logout" />
                  <p className="font-normal text-sm text-text-200">Sign out</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
