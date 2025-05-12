import React, { useEffect, useState } from 'react';
import AttachFile from '../../components/files/File';

import SearchFilter from '../../components/common/SearchFilters';
import { useGlobalContext } from '../../context/Context';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import DetailsInfomation from '../../components/account/DetailsInfomation';
import Icon from '../../icons/Icon';
import DeactivateMember from '../../components/account/DeactivateMember';
import RemoveUser from '../../components/account/RemoveUser';
import account from '../../services/apis/Account';
import ChangePassword from '../../components/account/ChangePassword';
import { toast } from 'sonner';
import ToastCustom from '../../components/common/ToastCustom';
import ModalInviteMember from '../../components/account/ModalInviteMember';
import ModalDeleteMemberGroup from '../../components/account/ModalDeleteMemberGroup';

const Account = () => {
  const [dataClickFilter, setDataClickFilter] = useState([]);
  const [isOpenInvite, setIsOpenInvite] = useState(false);
  const filterEnabled = dataClickFilter.filter((item) => item.realize === 'enabled');
  const createdTimestamp = dataClickFilter.filter((item) => item.realize === 'createdTimestamp');
  const [searchTerm, setSearchTerm] = useState('');
  const [infoMember, setInfoMember] = useState(null);
  const [selectIdMember, setSelectIdMember] = useState(null);
  const itemsPerPage = 10;
  const { infoWorkSpace } = useGlobalContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [userInformation, setUserInformation] = useState(null);
  const [isDeactivate, setIsDeactivate] = useState(false);
  const [isRemoveUser, setIsRemoveUser] = useState(false);
  const [listMember, setListMember] = useState(null);
  const [isOpenInfoUser, setIsOpenInfoUser] = useState(false);
  const [activeRowId, setActiveRowId] = useState(null); // Lưu trữ `id` bản ghi đang active
  const [loading, setLoading] = useState(true);
  const [callBack, setCallback] = useState(false);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [currentSort, setCurrentSort] = useState({ field: '', order: '' });
  const [isOpenDeleteMemberGroup, setIsOpenDeleteMemberGroup] = useState(false);

  const navigate = useNavigate();
  // Hàm bật/tắt popup menu theo id bản ghi
  const toggleMenu = (user) => {
    setActiveRowId(activeRowId === user.userId ? null : user.userId); // Bật/tắt popup của bản ghi có `id` cụ thể
  };
  // Hàm ẩn popup
  const closeMenu = () => {
    setActiveRowId(null);
  };

  // Api danh sách user
  const getListUser = async () => {
    try {
      const data = await account.getListmember(
        infoWorkSpace?.workspaceId,
        currentPage,
        itemsPerPage,
        searchTerm,
        filterEnabled[0]?.selectedValue.id,
        createdTimestamp[0]?.selectedValue?.status,
        currentSort.field !== '' ? `&orders=${currentSort.field}+${currentSort.order}` : ''
      );
      setListMember(data.data);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={error?.message} message="" t={t} />);
    }
  };

  useEffect(() => {
    if (infoWorkSpace?.workspaceId) {
      getListUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataClickFilter,
    infoWorkSpace,
    currentPage,
    itemsPerPage,
    searchTerm,
    infoWorkSpace?.workspaceId,
    callBack,
    currentSort,
  ]);
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [listMember]);

  const headers = [
    { label: 'Account', field: 'userName', sortable: true, width: 'w-[30%]' },
    { label: 'Staff ID', field: 'userCode', sortable: true, width: 'w-[15%]' },
    { label: 'Position', field: 'position', sortable: false, width: 'w-[15%]' },
    { label: 'Email', field: 'email', sortable: true, width: 'w-[25%]' },
    { label: 'Phone', field: 'phone', sortable: false, width: 'w-[15%]' },
  ];

  const handleSort = (field) => {
    const isAsc = currentSort.field === field && currentSort.order === 'asc';
    setCurrentSort({ field, order: isAsc ? 'desc' : 'asc' });
  };

  return (
    <div className="w-full max-h-[calc(99vh-64px)] overflow-y-auto relative">
      <div className="w-[1248px] m-auto pt-6 pb-3 flex flex-col gap-6 px-6">
        <div className="flex justify-between">
          <div>
            <p className="text-text-200 font-bold text-2xl">Members</p>
            <p className="font-normal text-sm text-text-100 ">View and manage all workspace members in one place.</p>
          </div>
          <div>
            <button
              className="text-white bg-primary-200 px-2 h-[40px] rounded font-medium text-base"
              onClick={() => setIsOpenInvite(true)}
            >
              Invite Member
            </button>
          </div>
          <div className="hidden">
            <Link to="/accounts/create">
              <button className="text-white bg-primary-200 px-2 h-[40px] rounded font-medium text-base">
                Create Member
              </button>
            </Link>
          </div>
        </div>

        <div>
          {/* Bộ lọc , tìm kiếm */}
          <div className=" ">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
              dataClickFilter={dataClickFilter}
              setDataClickFilter={setDataClickFilter}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate__animated animate__fadeIn">
            <div className="flex-grow min-h-[68vh]">
              <table class="w-full">
                <thead>
                  <tr className="border-b">
                    {headers.map(({ label, field, sortable, width }) => (
                      <th key={field} className={`text-start p-2 text-text-200 font-semibold text-sm ${width}`}>
                        <div
                          className={`flex gap-2 cursor-pointer ${sortable ? 'hover:opacity-75' : ''}`}
                          onClick={() => sortable && handleSort(field)}
                        >
                          <p>{label}</p>
                          {sortable && (
                            <span>
                              {currentSort.field === field ? (
                                currentSort.order === 'asc' ? (
                                  <Icon name="Sort" />
                                ) : (
                                  <Icon name="Sort" />
                                )
                              ) : (
                                <Icon name="Sort" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listMember?.dataList?.map((item) => (
                    <tr className="border-b relative group" key={item.userId}>
                      <td
                        className="px-3 py-2 cursor-pointer"
                        onClick={() => {
                          setIsOpenInfoUser(true);
                          setUserInformation(item);
                        }}
                      >
                        <div className="flex gap-3 items-center">
                          <AttachFile
                            attachType="WorkspaceAvatar"
                            entity="user"
                            seq={item?.userId}
                            register={null}
                            viewMode={false}
                            defaultImage={item?.username}
                            mode={'member' + item?.userId}
                            className="w-10 h-10 rounded border-[#091E4224] border"
                          />
                          <div>
                            <h2 className="text-sm font-medium text-text-200">
                              {item?.firstName} {item?.lastName}
                            </h2>
                            <p className="text-xs font-normal text-[#44546F]">@{item.userName}</p>
                          </div>
                          {item.enabled === 0 && (
                            <div className="text-xs text-red-500 border rounded-full px-2 py-1 border-red-500">
                              Disable
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        className="px-3 py-2 cursor-pointer"
                        onClick={() => {
                          setIsOpenInfoUser(true);
                          setUserInformation(item);
                        }}
                      >
                        <p className="text-text-100 font-normal text-sm">{item.userCode}</p>
                      </td>
                      <td
                        className="px-3 py-2 cursor-pointer"
                        onClick={() => {
                          setIsOpenInfoUser(true);
                          setUserInformation(item);
                        }}
                      >
                        <p className="text-text-100 font-normal text-sm">{item.position}</p>
                      </td>
                      <td
                        className="px-3 py-2 cursor-pointer w-[20%] break-words "
                        onClick={() => {
                          setIsOpenInfoUser(true);
                          setUserInformation(item);
                        }}
                      >
                        <p className="text-text-100 font-normal text-sm">{item.email}</p>
                      </td>

                      <td
                        className="px-3 py-2 cursor-pointer"
                        onClick={() => {
                          setIsOpenInfoUser(true);
                          setUserInformation(item);
                        }}
                      >
                        <p className="text-text-100 font-normal text-sm">{item?.phoneNumber}</p>
                      </td>

                      {/* Dấu 3 chấm */}
                      <td className="absolute right-3 top-3">
                        <div className="relative">
                          {/* Hiển thị dấu 3 chấm khi hover */}
                          <button
                            className="hidden group-hover:flex items-center justify-center w-8 h-8 rounded-full  "
                            onClick={() => toggleMenu(item)}
                          >
                            <Icon name="DotsHorizontal" className="rotate-90" />
                          </button>

                          {/* Popup Menu */}
                          {activeRowId === item.userId && (
                            <div
                              className="absolute bottom-0 right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
                              onMouseLeave={closeMenu}
                            >
                              <ul className="text-sm border rounded-lg">
                                <li
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-normal flex text-[#172B4D]  items-center gap-2 hover:border-l-2 hover:border-primary-200"
                                  onClick={() => navigate(`/accounts/update/${item.userId}`)}
                                >
                                  <Icon name="Edit03" />
                                  Edit
                                </li>
                                <li
                                  className="px-4 py-2 hover:bg-gray-100 hover:border-l-2 text-sm font-normal  hover:border-primary-200 cursor-pointer flex items-center gap-2 text-text-200"
                                  onClick={() => {
                                    setIsOpenChangePassword(true);
                                    setSelectIdMember(item.userId);
                                  }}
                                >
                                  <Icon name="Lock" />
                                  Change password
                                </li>
                                <li
                                  className={`${item.enabled ? 'text-red-500' : 'text-blue-500'} px-4 py-2 hover:bg-gray-100 hover:border-l-2 text-sm font-normal  hover:border-primary-200 cursor-pointer flex items-center gap-2 `}
                                  onClick={() => {
                                    setIsDeactivate(true);
                                    setInfoMember(item);
                                  }}
                                >
                                  {item.enabled === 0 ? (
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
                                    setInfoMember(item);
                                  }}
                                >
                                  <Icon name="delete" className="" />
                                  Leave
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {listMember?.totalItems > 10 && (
              <div className="flex justify-end">
                <Pagination
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  itemNumber={itemsPerPage}
                  pagination={listMember}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="">
        <DetailsInfomation
          setIsOpenInfoUser={setIsOpenInfoUser}
          isOpenInfoUser={isOpenInfoUser}
          userInformation={userInformation}
          setIsOpenChangePassword={setIsOpenChangePassword}
          setSelectIdMember={setSelectIdMember}
          setIsDeactivate={setIsDeactivate}
          setInfoMember={setInfoMember}
          setIsOpenDeleteMemberGroup={setIsOpenDeleteMemberGroup}
          isOpenDeleteMemberGroup={isOpenDeleteMemberGroup}
        />
      </div>
      <div>
        <DeactivateMember
          setIsOpenInfoUser={setIsOpenInfoUser}
          setIsDeactivate={setIsDeactivate}
          isDeactivate={isDeactivate}
          infoMember={infoMember}
          setCallback={setCallback}
          callBack={callBack}
        />
      </div>
      <div>
        <RemoveUser setIsRemoveUser={setIsRemoveUser} isRemoveUser={isRemoveUser} />
      </div>
      <div>
        <ChangePassword
          isOpenChangePassword={isOpenChangePassword}
          setIsOpenChangePassword={setIsOpenChangePassword}
          selectIdMember={selectIdMember}
        />
      </div>
      <div>
        <ModalInviteMember
          setIsOpenInvite={setIsOpenInvite}
          isOpenInvite={isOpenInvite}
          workspaceId={infoWorkSpace?.workspaceId}
          setCallback={setCallback}
          callBack={callBack}
        />
      </div>
      <div>
        <ModalDeleteMemberGroup
          setIsOpenInfoUser={setIsOpenInfoUser}
          infoMember={infoMember}
          setIsOpenDeleteMemberGroup={setIsOpenDeleteMemberGroup}
          isOpenDeleteMemberGroup={isOpenDeleteMemberGroup}
          workspaceId={infoWorkSpace?.workspaceId}
          setCallback={setCallback}
          callBack={callBack}
        />
      </div>
    </div>
  );
};

export default Account;
