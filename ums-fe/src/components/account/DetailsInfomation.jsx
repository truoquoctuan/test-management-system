import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../icons/Icon';
import AttachFile from '../../components/files/File';
import { useNavigate } from 'react-router-dom';
import account from '../../services/apis/Account';
import { formatDateTime2 } from '../common/FormatDate';
import { toast } from 'sonner';
import ToastCustom from '../common/ToastCustom';
import useOutsideClick from '../../hooks/useOutsideClick';

const DetailsInfomation = ({
  isOpenInfoUser,
  setIsOpenInfoUser,
  userInformation,
  setIsOpenChangePassword,
  setSelectIdMember,
  setIsDeactivate,
  setInfoMember,
  setIsOpenDeleteMemberGroup,
  isOpenDeleteMemberGroup,
}) => {
  const [isOpenDetailAndActivity, setIsOpenDetailAndActivity] = useState('detail');
  const [animationClass, setAnimationClass] = useState('');
  const [detailData, setDetailData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [isOpenDropdownMenu, setIsOpenDropdownMenu] = useState(false);

  const refMenu = useRef();
  const handleClose = () => {
    setAnimationClass('animate__fadeOutRight'); // Hiệu ứng đóng
    setTimeout(() => {
      setIsOpenInfoUser(false);
      setAnimationClass('');
      setIsOpenDropdownMenu(null);
    }, 500); // Đợi animation kết thúc
  };
  const getDetailActivityUser = async () => {
    try {
      const data = await account.getDetailActivityUser(userInformation?.userId);
      setDetailData(data.data);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={error?.message} message="" t={t} />);
    }
  };

  useEffect(() => {
    if (userInformation) {
      getDetailActivityUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInformation]);

  const groupByDate = (data) => {
    return data?.reduce((acc, curr) => {
      const date = new Date(curr.activityDateTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
      return acc;
    }, {});
  };

  const groupedData = groupByDate(detailData?.dataList);
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [userInformation]);

  useOutsideClick(refMenu, setIsOpenDropdownMenu);
  return (
    <div>
      <div
        className={`${isOpenInfoUser ? `w-[500px] animate__animated animate__fadeInRight ${animationClass}` : 'w-0 '} overflow-hidden  h-[93vh] bg-white  border  fixed top-16 right-0 z-[999] drop-shadow-2xl`}
      >
        <div className="flex justify-between border-b p-4">
          <p className="font-semibold text-lg text-text-200">Details Information</p>
          <div className="flex gap-3 items-center" ref={refMenu}>
            <div>
              <Icon
                name="DotsHorizontal"
                className="cursor-pointer pt-2"
                onClick={() => setIsOpenDropdownMenu(!isOpenDropdownMenu)}
              />
              {isOpenDropdownMenu && (
                <div className="absolute right-14  w-48 bg-white shadow-lg rounded-xl z-10">
                  <ul className="text-sm border rounded-lg">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-normal flex text-[#172B4D]  items-center gap-2 hover:border-l-2 hover:border-primary-200"
                      onClick={() => navigate(`/accounts/update/${userInformation?.userId}`)}
                    >
                      <Icon name="Edit03" />
                      Edit
                    </li>
                    {/* <li
                      className="px-4 py-2 hover:bg-gray-100 hover:border-l-2 text-sm font-normal  hover:border-primary-200 cursor-pointer flex items-center gap-2 text-text-200"
                      onClick={() => {
                        setIsOpenChangePassword(true);
                        setSelectIdMember(userInformation.userId);
                      }}
                    >
                      <Icon name="Lock" />
                      Change password
                    </li> */}
                    <li
                      className={`${userInformation.enabled ? 'text-red-500' : 'text-blue-500'} px-4 py-2 hover:bg-gray-100 hover:border-l-2 text-sm font-normal  hover:border-primary-200 cursor-pointer flex items-center gap-2 `}
                      onClick={() => {
                        setIsDeactivate(true);
                        setInfoMember(userInformation);
                      }}
                    >
                      {userInformation.enabled === 0 ? (
                        <>
                          <Icon name="Toggle03Right" className="" />
                          Activate
                        </>
                      ) : (
                        <>
                          <Icon name="Toggle02Right" className="" />
                          Inactive
                        </>
                      )}
                    </li>
                    <li
                      className={`text-red-500'  px-4 py-2 hover:bg-gray-100 hover:border-l-2 text-sm font-normal  text-red-500 hover:border-primary-200 cursor-pointer flex items-center gap-2 `}
                      onClick={() => {
                        setIsOpenDeleteMemberGroup(true);
                        setInfoMember(userInformation);
                      }}
                    >
                      <Icon name="delete" className="" />
                      Leave
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Icon
              name="Close"
              className="cursor-pointer"
              onClick={() => {
                handleClose();
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="loader"></div>
          </div>
        ) : (
          <div>
            <div className="p-6 animate__animated animate__fadeIn">
              <div className="flex gap-3 border border-[#091E4224] p-2 rounded bg-[#A1BDD914]">
                <AttachFile
                  attachType="WorkspaceAvatar"
                  entity="user"
                  seq={userInformation?.userId}
                  register={null}
                  viewMode={false}
                  defaultImage={userInformation?.username}
                  mode={'member' + userInformation?.userId}
                  className="w-10 h-10 rounded border-[#091E4224] border"
                />
                <div>
                  <h2 className="text-xl font-semibold text-text-200 ">
                    {userInformation?.firstName} {userInformation?.lastName}
                  </h2>
                  <p className="flex gap-3 text-xs font-normal text-[#44546F]   rounded-md">
                    @{userInformation?.userName}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6">
              <div className="flex border-b">
                <button
                  className={`${isOpenDetailAndActivity === 'detail' ? 'text-primary-200 border-b-2 border-primary-200' : ''} w-[130px] py-2  text-sm font-medium `}
                  onClick={() => setIsOpenDetailAndActivity('detail')}
                >
                  Details
                </button>
                <button
                  className={`${isOpenDetailAndActivity === 'activity' ? 'text-primary-200 border-b-2 border-primary-200' : ''} w-[130px] py-2  text-sm font-medium `}
                  onClick={() => setIsOpenDetailAndActivity('activity')}
                >
                  Activity
                </button>
              </div>
            </div>
            {isOpenDetailAndActivity === 'detail' && (
              <div className="px-6 py-6 flex flex-col gap-6">
                <div className="flex ">
                  <div className="w-1/2 ">
                    <p className="text-text-100 font-normal text-xs">Gender</p>
                    <p className="font-medium text-text-200 text-sm pt-1">
                      {userInformation?.gender ? userInformation?.gender : 'None'}
                    </p>
                  </div>
                  <div className=" w-1/2">
                    <p className="text-text-100 font-normal text-xs">Date of Birth</p>
                    <p className="font-medium text-text-200 text-sm pt-1">
                      {userInformation?.birthDate ? userInformation?.birthDate : 'None'}
                    </p>
                  </div>
                </div>

                <div className="flex ">
                  <div className="w-1/2 ">
                    <p className="text-text-100 font-normal text-xs">Phone number</p>
                    <p className="font-medium text-text-200 text-sm pt-1">
                      {userInformation?.phoneNumber ? userInformation?.phoneNumber : 'None'}
                    </p>
                  </div>
                  <div className=" w-1/2">
                    <p className="text-text-100 font-normal text-xs">Email</p>
                    <p className="font-medium text-text-200 text-sm pt-1 break-words ">
                      {userInformation?.email ? userInformation?.email : 'None'}
                    </p>
                  </div>
                </div>
                <div className="">
                  <p className="text-text-100 font-normal text-xs">Address</p>
                  <p className="font-medium text-text-200 text-sm pt-1">
                    {userInformation?.address ? userInformation?.address : 'None'}
                  </p>
                </div>
                <div className="flex ">
                  <div className="w-1/2 ">
                    <p className="text-text-100 font-normal text-xs">Staff ID</p>
                    <p className="font-medium text-text-200 text-sm pt-1">
                      {userInformation?.userCode ? userInformation?.userCode : 'None'}
                    </p>
                  </div>
                  <div className=" w-1/2">
                    <p className="text-text-100 font-normal text-xs">Position</p>
                    <p className="font-medium text-text-200 text-sm pt-1">
                      {userInformation?.position ? userInformation?.position : 'None'}
                    </p>
                  </div>
                </div>
                <div className="">
                  <p className="text-text-100 font-normal text-xs">Join date</p>
                  <p className="font-medium text-text-200 text-sm pt-1">
                    {userInformation?.startDate ? userInformation?.startDate : 'None'}
                  </p>
                </div>
              </div>
            )}
            {isOpenDetailAndActivity === 'activity' && (
              <div className="p-6 h-[70vh] custom-scroll-y">
                {groupedData && Object.keys(groupedData).length === 0 ? (
                  // Hiển thị thông báo nếu không có hoạt động nào
                  <div className="text-center text-gray-500 text-sm">No activity</div>
                ) : (
                  <>
                    {groupedData &&
                      Object.entries(groupedData).map(([date, activities], dateIndex) => (
                        <div key={dateIndex} className="mb-8 animate__animated animate__fadeIn">
                          {/* Ngày */}
                          <h2 className="text-lg font-semibold mb-4">{date}</h2>
                          <div className="relative pl-6">
                            {activities.map((item, index) => (
                              <div key={index} className="flex items-start gap-4 mb-6">
                                {/* Icon */}
                                <div className="relative">
                                  <AttachFile
                                    attachType="WorkspaceAvatar"
                                    entity="user"
                                    seq={item?.userId}
                                    register={null}
                                    viewMode={false}
                                    defaultImage={item?.userId}
                                    mode={'member' + item?.userId}
                                    className="w-10 h-10 rounded-full border-[#091E4224] border"
                                  />
                                  {/* Đường kẻ giữa các hoạt động */}
                                  {index !== activities.length - 1 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-[1px] h-full bg-gray-300"></div>
                                  )}
                                </div>
                                {/* Nội dung */}
                                <div>
                                  <p className="text-gray-700 text-sm">{item.content}</p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    {formatDateTime2(item?.activityDateTime) || 'Time not provided'} • by{' '}
                                    <span className="text-primary-200">
                                      {item.authorLastNm} {item.authorFirstNm}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* )} */}
    </div>
  );
};

export default DetailsInfomation;
