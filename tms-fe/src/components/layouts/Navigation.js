import AttachFile from 'components/AttachFile/AttachFile';
import ModalComponent from 'components/common/Modal';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../icons/icons';

import { useMutation, useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import { CHECKED_ALL_NOTIFY, COUNT_NOTIFY_BY_USERID } from 'apis/notification/notification';
import { customStyles } from 'components/common/FormatModal';
import Notification from 'pages/notification';
import keycloak from 'service/keycloak/Keycloak';
import loBzware from '../../assets/images/logo_bzware.svg';
const Navigation = () => {
    const [isLogOut, setIslogOut] = useState(false);
    const [isOpenNoti, setIsOpenNoti] = useState(false);
    const [isOpenUserInfo, setIsOpenUserInfo] = useState(false);
    const { userInfo, isSocketNoti, changeStatusNoti, authenticated } = useGlobalContext();

    const moreRef = useRef();
    useOutsideClick(moreRef, setIsOpenNoti);
    const location = useLocation();
    const locationAct = '/' + location?.pathname?.split('/')[1];
    const navigate = useNavigate();
    const handleShowLogOut = () => {
        setIslogOut(!isLogOut);
    };

    const hendleLogout = () => {
        keycloak.logout({ redirectUri: window.location.origin });
    };

    const moreFef = useRef();
    const [isClosing, setIsClosing] = useState(false);
    useOutsideClick(moreFef, setIslogOut);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpenUserInfo(false);
            setIsClosing(false);
        }, 500);
    };

    const { data: getCountNotifi, refetch } = useQuery(COUNT_NOTIFY_BY_USERID, {
        client: clientRepo,
        variables: { userId: userInfo?.userID },
        skip: userInfo ? false : true
    });

    const [checkCountNoti] = useMutation(CHECKED_ALL_NOTIFY, { client: clientRepo });

    const handleCheckRepo = async () => {
        try {
            await checkCountNoti({ variables: { userId: userInfo?.userID } });
            await refetch();
        } catch (error) {
            console.log('error', error);
        }
    };
    useEffect(() => {
        if (isSocketNoti) {
            refetch();
            changeStatusNoti();
        }
    }, [isSocketNoti]);

    return (
        <div className="flex h-[72px] items-center justify-between bg-white p-5">
            <div className="flex gap-10">
                <div className="flex items-center gap-2 ">
                    <Icon name="logo" className="fill-[#0066cc]" />
                    <p className="text-xl font-bold text-blue-600">Quality Assurance</p>
                </div>
                <div className="flex">
                    <button
                        className={`w-[150px] text-sm font-medium  ${
                            locationAct === '/' ? 'bg-[#0066CC] text-white' : 'bg-[#F4F4F4]'
                        }`}
                        onClick={() => navigate('/')}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`w-[150px] text-sm font-medium ${
                            locationAct === '/test-plan' ? ' bg-[#0066CC] text-white' : 'bg-[#F4F4F4]'
                        }`}
                        onClick={() => navigate('/test-plan')}
                    >
                        Test Plan
                    </button>
                </div>
            </div>
            <div className="  flex items-center gap-8">
                <div>
                    <Icon name="nav" />
                </div>
                <div className="relative" ref={moreRef}>
                    <div
                        onClick={() => {
                            setIsOpenNoti(!isOpenNoti), handleCheckRepo();
                        }}
                        className="hover:bg-neu-500 relative cursor-pointer "
                    >
                        <Icon name="bell" />
                        {getCountNotifi?.countNotifyByUserId > 0 && (
                            <span
                                className={`absolute flex items-center justify-center bg-red-500 text-[10px] font-medium leading-3 text-white ${
                                    getCountNotifi?.countNotifyByUserId < 100
                                        ? '-right-3 -top-1.5 h-5 w-5 rounded-[100%]'
                                        : '-right-4 -top-[6px] rounded-full px-1 py-[2px]'
                                }`}
                            >
                                {getCountNotifi?.countNotifyByUserId < 100
                                    ? getCountNotifi?.countNotifyByUserId
                                    : '99+'}
                            </span>
                        )}
                    </div>

                    {isOpenNoti && (
                        <div className="absolute -bottom-8 -right-3 z-[999] h-full">
                            <Notification setIsOpenNoti={setIsOpenNoti} />
                        </div>
                    )}
                </div>
                <div title="Bzware">
                    <Link to="https://bzware.bzcom.vn/#/">
                        <img src={loBzware} />
                    </Link>
                </div>
                <div className="flex cursor-pointer items-center">
                    <div className="relative " ref={moreFef}>
                        <div onClick={handleShowLogOut}>
                            <AttachFile
                                attachType="UserAvatar"
                                entity="user"
                                seq={userInfo?.userID}
                                keyProp={userInfo?.userID}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        </div>
                        {isLogOut && (
                            <div>
                                <div className="absolute right-4  z-10 mt-1   shadow-md">
                                    <div
                                        className="flex h-[40px] w-[181px] items-center  gap-2  bg-white pl-6 font-bold hover:bg-gray-100 "
                                        onClick={() => setIsOpenUserInfo(true)}
                                    >
                                        <Icon name="user" />
                                        <p className="text-[12px]">Profile</p>
                                    </div>
                                    <div
                                        className="flex h-[40px] w-[181px] items-center  gap-2  bg-white pl-6 font-bold hover:bg-gray-100 "
                                        onClick={hendleLogout}
                                    >
                                        <Icon name="Vector" />
                                        <p className="text-[12px]">Logout</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <ModalComponent
                        isOpen={isOpenUserInfo}
                        setIsOpen={setIsOpenUserInfo}
                        setIsClosing={setIsClosing}
                        isClosing={isClosing}
                        style={customStyles}
                    >
                        <div className="max-h-[600px] w-[600px] p-4">
                            <div className="flex justify-between">
                                <p className="text-lg font-semibold text-primary-1">Personal information</p>
                                <div onClick={() => handleClose()} className="cursor-pointer">
                                    <Icon name="close" className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex  gap-4">
                                    <div className="h-36 w-36">
                                        <AttachFile
                                            attachType="UserAvatar"
                                            entity="user"
                                            seq={userInfo?.userID}
                                            keyProp={userInfo?.userID}
                                            className="h-36 w-36  object-cover"
                                        />
                                    </div>

                                    <div>
                                        <div>
                                            <p className="text-xl font-bold">
                                                {authenticated?.lastName} {authenticated?.firstName}
                                            </p>
                                            <p className="text-sm ">@{authenticated?.username}</p>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <p className="text-sm">Employee code:</p>
                                            <p className="py-1  text-sm font-semibold">
                                                {authenticated?.attributes?.userCode[0]}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <p className="text-sm">Location:</p>
                                            <p className="py-1 text-sm font-semibold">
                                                {authenticated?.attributes?.position[0]}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <p className="text-sm">Phone number:</p>
                                            <p className="py-1 text-sm font-semibold">
                                                {authenticated?.attributes?.phoneNumber[0]}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <p className="text-sm">Email:</p>
                                            <p className="py-1 text-sm font-semibold">{userInfo?.email}</p>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <p className="text-sm">Address:</p>
                                            <p className="py-1 text-sm font-semibold">
                                                {authenticated?.attributes?.address[0]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalComponent>
                </div>
            </div>
        </div>
    );
};

export default Navigation;
