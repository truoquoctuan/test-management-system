import { useMutation, useQuery } from '@apollo/client';
import { clientRepo } from 'apis/apollo/apolloClient';
import {
    DISABLE_ALL_NOTIFY,
    DISABLE_NOTIFY,
    GET_ALL_NOTIFY_BY_USERID,
    MARK_ALL_ASREAD,
    MARK_AS_READ
} from 'apis/notification/notification';
import AttachFile from 'components/AttachFile/AttachFile';
import { formatTime } from 'components/common/ConvertTime';
import Empty from 'components/common/Empty';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const StringToHTML = (props) => {
    const { string, className } = props;
    return <p className={className} dangerouslySetInnerHTML={{ __html: string }} />;
};
const Notification = ({ setIsOpenNoti }) => {
    const [isNotificationSub, setIsNotificationSub] = useState(false);
    const [idNotifi, setIdNotifi] = useState(null);
    const [listNotify, setListNotify] = useState(null);
    const navigate = useNavigate();
    const moreRef = useRef();
    useOutsideClick(moreRef, setIsNotificationSub);
    const { userInfo, isSocketNoti, changeStatusNoti } = useGlobalContext();
    const [size, setSize] = useState(20);
    // Get danh sách thông báo
    const { data: getallNoti, refetch } = useQuery(GET_ALL_NOTIFY_BY_USERID, {
        client: clientRepo,
        variables: { page: 0, size: size, userId: String(userInfo?.userID) },
        skip: userInfo ? false : true,
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (isSocketNoti) {
            refetch();
            changeStatusNoti();
        }
    }, [isSocketNoti]);

    useEffect(() => {
        if (getallNoti) {
            setListNotify(getallNoti);
        }
    }, [getallNoti]);

    // Gỡ thông báo
    const [deteleNotifi] = useMutation(DISABLE_NOTIFY, { client: clientRepo });
    const handleDeteleNotifi = async (id) => {
        try {
            await deteleNotifi({ variables: { disable: true, notifyId: id } });
            setIsNotificationSub(false);
            refetch();
            toast.success('Delete notification successful');
        } catch (error) {
            toast.error('Error');
        }
    };

    // Gỡ tất cả thông báo
    const [deleteAllNoti] = useMutation(DISABLE_ALL_NOTIFY, { client: clientRepo });
    const handleRemoveAllNoti = async () => {
        try {
            await deleteAllNoti({ variables: { userId: userInfo?.userID } });
            await refetch();
            toast.success('Delete notification successful');
        } catch (error) {
            toast.error('Error');
        }
    };
    //

    // Đánh dấu đã đọc
    const [markAsRead] = useMutation(MARK_AS_READ, { client: clientRepo });
    const handleMakeAsRead = async (notifyId, status) => {
        try {
            await markAsRead({ variables: { notifyId: notifyId, status: status } });
            await refetch();
            setIsNotificationSub(false);
        } catch (error) {
            toast.error('Error');
        }
    };

    // Đánh dấu tất cả đã đọc
    const [markAllRead] = useMutation(MARK_ALL_ASREAD, { client: clientRepo });
    const handleMarkAllRead = async () => {
        try {
            await markAllRead({ variables: { userId: userInfo?.userID } });
            await refetch();
        } catch (error) {
            toast.error('Error');
        }
    };
    const tableContainerRef = useRef(null);

    const handleScroll = () => {
        const container = tableContainerRef.current;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setSize((prevSize) => prevSize + 5);
        }
    };
    useEffect(() => {
        const container = tableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);
    return (
        <div className=" max-h-[calc(80vh-64px)] min-h-[calc(30vh-64px)] w-[420px]  border bg-white   shadow-lg">
            <div className="flex justify-between px-4 pt-4 ">
                <p className="text-lg font-bold">Notification</p>
                <div className="cursor-pointer" onClick={() => setIsOpenNoti(false)}>
                    <Icon name="close" className="h-3 w-3" />
                </div>
            </div>
            <div className="flex justify-end gap-4 px-4 pb-2">
                <p className="cursor-pointer text-sm font-normal text-primary-1" onClick={() => handleMarkAllRead()}>
                    Mark all as read
                </p>
                <p className="cursor-pointer text-sm font-normal text-primary-1" onClick={() => handleRemoveAllNoti()}>
                    Remove all
                </p>
            </div>
            <hr />
            <div className="custom-scroll-y mt-4 h-[60vh] max-h-[calc(65vh-64px)] " ref={tableContainerRef}>
                {listNotify?.getAllNotifyByUserId?.notifies?.map((noti, index) => {
                    return (
                        <div className={`flex cursor-pointer gap-2 px-4 py-2 hover:bg-[#F4F4F4] `} key={index}>
                            <div className="w-[95%]">
                                <Link to={noti.link}>
                                    <div
                                        className={`flex gap-3 ${noti?.status == false ? '' : 'opacity-70'}`}
                                        onClick={() => {
                                            handleMakeAsRead(noti?.notifyId, true), navigate(noti.link);
                                        }}
                                    >
                                        <div className="w-[12%]">
                                            <AttachFile
                                                attachType="UserAvatar"
                                                entity="user"
                                                seq={noti?.senderId}
                                                className="h-10 w-10 rounded-full object-cover"
                                                keyProp={noti?.senderId}
                                            />
                                        </div>

                                        <div className="w-[87%]">
                                            <div className={`text-sm`}>
                                                {' '}
                                                <StringToHTML
                                                    string={noti?.notifyContent}
                                                    className="notify-title mb-1"
                                                />
                                            </div>
                                            <p className={`text-sm  text-primary-1`}>{formatTime(noti?.createdAt)}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className=" group relative flex w-[5%] ">
                                <div
                                    onClick={() => {
                                        setIsNotificationSub(!isNotificationSub), setIdNotifi(noti?.notifyId);
                                    }}
                                    className="w-full"
                                >
                                    <Icon name="vertical_dots" />
                                </div>

                                {isNotificationSub && idNotifi === noti?.notifyId && (
                                    <ul className="absolute -bottom-6 right-[calc(100%+8px)] z-[9999] h-[92px] whitespace-nowrap border bg-white  p-2 text-xs font-normal shadow-[0px_6px_58px_rgba(121,145,173,0.2)]">
                                        {/* Mark as read or unread */}
                                        {noti?.status == true ? (
                                            <li
                                                className="h-[38px] cursor-pointer p-2 font-medium hover:bg-slate-100 hover:text-primary-1 "
                                                onClick={() => handleMakeAsRead(noti?.notifyId, false)}
                                            >
                                                Mark as unread
                                            </li>
                                        ) : (
                                            <li
                                                className="h-[38px] cursor-pointer p-2 font-medium hover:bg-slate-100 hover:text-primary-1 "
                                                onClick={() => handleMakeAsRead(noti?.notifyId, true)}
                                            >
                                                Mark as read
                                            </li>
                                        )}

                                        {/* Remote this notification */}
                                        <li
                                            className="h-[38px] cursor-pointer p-2 font-medium hover:bg-slate-100 hover:text-red-500"
                                            onClick={() => handleDeteleNotifi(noti?.notifyId)}
                                        >
                                            Remove this notification
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    );
                })}
                {getallNoti?.getAllNotifyByUserId?.notifies?.length === 0 && (
                    <div className="mb-4">
                        <Empty notFoundMessage={`No recent unread notifications.`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;
