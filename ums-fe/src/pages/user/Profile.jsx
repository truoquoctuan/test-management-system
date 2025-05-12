import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/Context';
import AttachFile from '../../components/files/File';
import account from '../../services/apis/Account';
import { useNavigate } from 'react-router-dom';
import { formatDateTime2 } from '../../components/common/FormatDate';
import { toast } from 'sonner';
import ToastCustom from '../../components/common/ToastCustom';

const Profile = () => {
  const { userInfo } = useGlobalContext();
  const [detailUser, setDetailUser] = useState(''); // Trạng thái lưu giá trị được chọn
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const fetchUserInfo = async () => {
    try {
      const { data } = await account.getUserDetail(userInfo?.subject);
      setDetailUser(data.data);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={'Error fetching user info'} message="" t={t} />);
    }
  };

  useEffect(() => {
    if (userInfo?.subject) {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.subject]);

  const getDetailActivityUser = async () => {
    try {
      const data = await account.getDetailActivityUser(userInfo?.subject);
      setDetailData(data.data);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={error?.message} message="" t={t} />);
    }
  };

  useEffect(() => {
    if (userInfo?.subject) {
      getDetailActivityUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.subject]);

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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-[1248px] m-auto pt-10 px-10 animate__animated animate__fadeIn">
      <div className="flex justify-between">
        <div className="flex gap-6">
          <div>
            <AttachFile
              attachType="WorkspaceAvatar"
              entity="user"
              seq={userInfo?.subject}
              register={null}
              viewMode={false}
              defaultImage={userInfo?.subject}
              mode={'member' + userInfo?.subject}
              className="w-[96px] h-[96px] rounded-lg border-[#091E4224] border"
            />
          </div>
          <div>
            <p className="text-text-200 text-[28px] font-bold">
              {detailUser?.lastName} {detailUser?.firstName}
            </p>
            <p className="text-text-100 text-base font-normal ">@{detailUser?.userName}</p>
          </div>
        </div>
        <div>
          <button
            className="font-medium text-sm text-text-200 bg-[#F1F2F4] py-2 px-4 rounded-md"
            onClick={() => navigate(`/profile/update/${userInfo?.subject}`)}
          >
            Edit profile
          </button>
        </div>
      </div>

      <div className="flex gap-6 mt-6">
        <div className="w-1/2">
          <h2 className="text-text-200 font-medium text-base mb-2">About</h2>
          <div className="px-6 py-6 flex flex-col gap-6  border rounded-xl">
            <div className="flex ">
              <div className="w-1/2 ">
                <p className="text-text-100 font-normal text-xs">Gender</p>
                <p className="font-medium text-text-200 text-sm pt-1">
                  {detailUser?.gender ? detailUser?.gender : 'None'}
                </p>
              </div>
              <div className=" w-1/2">
                <p className="text-text-100 font-normal text-xs">Date of Birth</p>
                <p className="font-medium text-text-200 text-sm pt-1">
                  {detailUser?.birthDate ? detailUser?.birthDate : 'None'}
                </p>
              </div>
            </div>

            <div className="flex ">
              <div className="w-1/2 ">
                <p className="text-text-100 font-normal text-xs">Phone number</p>
                <p className="font-medium text-text-200 text-sm pt-1">
                  {detailUser?.phoneNumber ? detailUser?.phoneNumber : 'None'}
                </p>
              </div>
              <div className=" w-1/2">
                <p className="text-text-100 font-normal text-xs">Email</p>
                <p className="font-medium text-text-200 text-sm pt-1">
                  {detailUser?.email ? detailUser?.email : 'None'}
                </p>
              </div>
            </div>
            <div className="">
              <p className="text-text-100 font-normal text-xs">Address</p>
              <p className="font-medium text-text-200 text-sm pt-1">
                {detailUser?.address ? detailUser?.address : 'None'}
              </p>
            </div>
            <div className="flex ">
              <div className="w-1/2 ">
                <p className="text-text-100 font-normal text-xs">Staff ID</p>
                <p className="font-medium text-text-200 text-sm pt-1">
                  {detailUser?.userCode ? detailUser?.userCode : 'None'}
                </p>
              </div>
              <div className=" w-1/2">
                <p className="text-text-100 font-normal text-xs">Position</p>
                <p className="font-medium text-text-200 text-sm pt-1">
                  {detailUser?.position ? detailUser?.position : 'None'}
                </p>
              </div>
            </div>
            <div className="">
              <p className="text-text-100 font-normal text-xs">Join date</p>
              <p className="font-medium text-text-200 text-sm pt-1">
                {detailUser?.startDate ? detailUser?.startDate : 'None'}
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <div>
            <h2 className="text-text-200 font-medium text-base mb-2">Activity</h2>
            <div className="p-6 max-h-[calc(72vh-64px)] min-h-[calc(38vh-64px)] custom-scroll-y border rounded-xl">
              {groupedData && Object?.keys(groupedData).length === 0 ? (
                // Hiển thị thông báo nếu không có hoạt động nào
                <div className="text-center text-gray-500 text-sm">No activity</div>
              ) : (
                <>
                  {groupedData &&
                    Object?.entries(groupedData).map(([date, activities], dateIndex) => (
                      <div key={dateIndex} className="mb-8">
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
                                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-[2px] h-full bg-gray-300"></div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
