import { useQuery } from '@apollo/client';
import { GET_ALL_USER_FORM_BZW, GET_POSITION } from 'apis/apollo/test-plan/query';
import AttachFile from 'components/AttachFile/AttachFile';
import Empty from 'components/common/Empty';
import Icon from 'components/icons/icons';
import { useGlobalContext } from 'context/Context';
import useOutsideClick from 'hook/useOutsideClick';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import DeleteMember from '../DeleteMember';

// eslint-disable-next-line no-unused-vars
const CreateMember = ({ isMembers, projectId, listMember, setListMember, openCloseMember, typeProject }) => {
    // eslint-disable-next-line no-unused-vars
    const [checkedMember, setCheckedMember] = useState([]);
    const [searchClick, setSearchClick] = useState(false);
    const [projectRole, setProjectRole] = useState(false);
    const [projectLocation, setProjectLocation] = useState(false);
    const [projectRoleId, setProjectRoleID] = useState();
    const [isOpen, setIsOpen] = useState(false);

    const modalRef = useRef(null);
    useOutsideClick(modalRef, setSearchClick);
    useOutsideClick(modalRef, setProjectRole);
    useOutsideClick(modalRef, setProjectLocation);
    const [member, setMember] = useState();
    const { userInfo, changeIdUserInfomation } = useGlobalContext();
    const userId = userInfo?.userID;

    // API danh sách vị tri

    const { data: dataPosition } = useQuery(GET_POSITION, { variables: { page: 0, size: 10 } });

    // Phương thức sử lý API tìm kiếm thành viên
    const [name, setName] = useState('');
    const { data: dataListMember } = useQuery(GET_ALL_USER_FORM_BZW, { variables: { name, userId } });

    useEffect(() => {
        if (dataListMember) {
            setMember(dataListMember.getAllUserFromBZW);
        }
    }, [dataListMember]);

    // Debounce the search input
    const debouncedSearch = useCallback(
        debounce((value) => {
            setName(value);
        }, 300), // Adjust the debounce delay (in milliseconds) as needed
        []
    );

    const handleInputChange = (e) => {
        debouncedSearch(e.target.value);
    };
    // Phương thức thêm thành viên vào mảng
    const handleChangeMember = (member) => {
        const memberProject = {
            fullName: member?.fullName,
            userId: member?.userID,
            userName: member?.userName,
            roleTestPlan: 2,
            positions: [
                {
                    positionId: '4',
                    positionName: 'QA'
                }
            ]
        };
        const isDuplicateId = listMember?.some((item) => item.userId === memberProject.userId);
        if (isDuplicateId === false) {
            setListMember([...listMember, memberProject]);
            setSearchClick(false);
        } else {
            toast.warning('warning');
        }
    };
    // Chỉnh sủa quyền của member
    const updateRole = (userId, newRole, location) => {
        const userIndex = listMember.findIndex((user) => user.userId === userId);
        if (userIndex !== -1) {
            const user = listMember[userIndex];
            const existingLocations = user.positions || [];
            // Kiểm tra xem vị trí đã tồn tại chưa
            const locationIndex = existingLocations.findIndex(
                (locations) => locations.positionId === location?.positionId
            );
            if (locationIndex === -1) {
                // Nếu không tồn tại, thêm vào mảng
                const updatedUsers = [...listMember];
                if (location?.positionId === null) {
                    const updatedLocations = [...existingLocations];
                    updatedUsers[userIndex] = {
                        ...user,
                        roleTestPlan: newRole,
                        positions: updatedLocations
                    };
                    setListMember(updatedUsers);
                } else {
                    // Tích thêm mới vị trí
                    const updatedLocations =
                        location !== null
                            ? [
                                  ...existingLocations,
                                  { positionId: location?.positionId, positionName: location?.positionName }
                              ]
                            : existingLocations;
                    updatedUsers[userIndex] = {
                        ...user,
                        roleTestPlan: newRole,
                        positions: updatedLocations
                    };
                    setListMember(updatedUsers);
                }
            } else {
                // Nếu tồn tại, xóa khỏi mảng
                if (user?.positions?.length > 1) {
                    const updatedUsers = [...listMember];
                    const updatedLocations = [...existingLocations];
                    updatedLocations.splice(locationIndex, 1);
                    updatedUsers[userIndex] = { ...user, roleTestPlan: newRole, positions: updatedLocations };
                    setListMember(updatedUsers);
                }
            }
        } else {
            console.log('error');
        }
    };
    const [isCheckAll, setIsCheckAll] = useState(false);
    const handleCheckAll = (e) => {
        setIsCheckAll(e.target.checked);
        if (e.target.checked) {
            const allMemnber = listMember.map((item) => item?.userId);
            setCheckedMember(allMemnber);
        } else {
            setCheckedMember([]);
        }
    };

    // Chọn thành viên
    const handleDeleMember = (e, userId) => {
        if (e.target.checked) {
            setCheckedMember([...checkedMember, userId]);
        } else {
            setCheckedMember(checkedMember?.filter((id) => id !== userId));
        }
    };
    //   Xóa member
    const handleDeletMember = () => {
        const filteredUsers = listMember.filter((user) => !checkedMember.includes(user.userId));
        setListMember(filteredUsers);
        setCheckedMember([]), setIsCheckAll(false);
        setIsOpen(false);
    };

    return (
        <div className={`grid transition-all duration-500 ${!isMembers ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
                {/* Tìm kiếm thành viên */}
                <div className="relative flex w-full justify-end">
                    <div className="relative flex justify-end">
                        <div className="absolute left-2 top-2">
                            <Icon name="search" className="fill-[#9C9C9C]" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, username"
                            className="focus:border-primary-100   h-[36px] w-[420px]  border border-[#F1F3FD]  bg-white pl-8  placeholder:text-sm focus:outline-none"
                            onClick={() => setSearchClick(true)}
                            onChange={handleInputChange}
                        />

                        {searchClick === true && (
                            <div
                                className="custom-scroll-y absolute top-10  z-30 max-h-[350px] w-full    bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]"
                                ref={modalRef}
                            >
                                {member
                                    ?.filter((user) => !listMember?.map((user) => user?.userId)?.includes(user?.userID))
                                    ?.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="flex  w-full cursor-pointer gap-4 border-t px-4 py-2 hover:bg-[#D9D9D9]"
                                                onClick={() => handleChangeMember(item)}
                                            >
                                                <AttachFile
                                                    attachType="UserAvatar"
                                                    entity="user"
                                                    seq={item?.userID}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    keyProp={item?.userID}
                                                />
                                                <div>
                                                    <p className="flex items-center">{item?.fullName}</p>
                                                    <p>@{item?.userName}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
                {/* End */}
                {checkedMember.length > 0 && (
                    <div className="mt-4 flex h-[52px] items-center justify-between bg-[#F4F4F4] px-3">
                        <div
                            className="mt-1.5 cursor-pointer"
                            onClick={() => {
                                setCheckedMember([]), setIsCheckAll(false);
                            }}
                        >
                            <Icon name="close" className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-[#FF6060]">
                                Selected
                                <span className="pl-2 font-bold">
                                    {'('}
                                    {checkedMember.length}
                                    {')'}
                                </span>
                            </p>
                            <p
                                className="border border-[#FF6060] px-2 py-1 text-sm font-bold text-[#FF6060]"
                                onClick={() => setIsOpen(true)}
                            >
                                Remove
                            </p>
                        </div>
                    </div>
                )}

                {/* Bảng thành viên */}
                <div className="z-[900] mt-4 min-h-[300px] overflow-y-auto">
                    <div className="    border">
                        <table className="w-full   ">
                            <thead className="w-full  ">
                                <tr className="   bg-[#F2F2F2]">
                                    <th className="  w-[1%] py-4 pl-4 text-right">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => handleCheckAll(e)}
                                            checked={isCheckAll}
                                        />{' '}
                                    </th>
                                    <th className="w-[25%]   py-4 pl-4 text-left">Member </th>
                                    <th className="w-[25%]  p-4 text-left">Role </th>
                                    <th className="w-[25%]  p-4 text-left"> Position</th>
                                </tr>
                            </thead>
                            {listMember?.length !== 0 && (
                                <tbody>
                                    {listMember?.map((item, index) => {
                                        const dateElement = document.getElementById(`date-user-${index}`);
                                        // validate input date new
                                        if (dateElement) {
                                            dateElement.min = new Date().toLocaleDateString('sv-SE', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            });
                                        }

                                        return (
                                            <tr className="border-t pt-3" key={index}>
                                                <td className="text-right">
                                                    <input
                                                        type="checkbox"
                                                        onChange={(e) => handleDeleMember(e, item?.userId)}
                                                        checked={checkedMember.includes(item?.userId)}
                                                    />
                                                </td>
                                                {/* Ảnh đại diện , tên tài khoản */}
                                                <td className=" flex items-center gap-4 rounded-bl-xl bg-white p-2  px-4 text-left">
                                                    <div
                                                        onClick={() => changeIdUserInfomation(item?.userId)}
                                                        className="cursor-pointer"
                                                    >
                                                        <AttachFile
                                                            attachType="UserAvatar"
                                                            entity="user"
                                                            seq={item?.userId}
                                                            className="h-8 w-8 rounded-full object-cover"
                                                            keyProp={item?.userId}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h2 className="font-semibold">{item?.fullName}</h2>
                                                        <p className="text-gray-400">@{item?.userName}</p>
                                                    </div>
                                                </td>
                                                {/* Vai trò */}
                                                <td className=" cursor-pointer bg-white p-2 text-left font-normal ">
                                                    <div className="flex   ">
                                                        <div
                                                            className="flex w-[160px]  justify-between  gap-4 border  p-2"
                                                            onClick={() => {
                                                                setProjectRole(true), setProjectRoleID(item?.userId);
                                                            }}
                                                        >
                                                            <h2>
                                                                {item?.roleTestPlan === 2 && 'Editor'}
                                                                {item?.roleTestPlan === 3 && 'Viewer'}
                                                            </h2>
                                                            <Icon name="down" className="fill-[#383737]" />
                                                        </div>
                                                    </div>
                                                    {projectRole === true && item?.userId === projectRoleId && (
                                                        <div
                                                            className="absolute  z-[999] w-[160px] bg-white p-3 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.24)]"
                                                            ref={modalRef}
                                                        >
                                                            <p
                                                                className={` p-2  hover:bg-[#D9D9D9] ${
                                                                    item?.roleTestPlan === 2 &&
                                                                    ' bg-[#D9D9D9] text-black'
                                                                }`}
                                                                onClick={() => {
                                                                    updateRole(item.userId, 2, null),
                                                                        setProjectRole(false);
                                                                }}
                                                            >
                                                                Editor
                                                            </p>
                                                            <p
                                                                className={`mt-2  p-2  hover:bg-[#D9D9D9] ${
                                                                    item?.roleTestPlan === 3 &&
                                                                    ' bg-[#D9D9D9] text-black'
                                                                }`}
                                                                onClick={() => {
                                                                    updateRole(item.userId, 3, null),
                                                                        setProjectRole(false);
                                                                }}
                                                            >
                                                                Viewer
                                                            </p>
                                                        </div>
                                                    )}
                                                </td>
                                                {/* Vị trí - Position */}
                                                <td className=" cursor-pointer bg-white p-2 text-left font-normal ">
                                                    <div>
                                                        <div className="flex">
                                                            <div
                                                                className={`flex min-w-[100px]  ${
                                                                    typeProject === ''
                                                                        ? 'border-2 hover:border-[#ff9966]'
                                                                        : ''
                                                                } border  p-2`}
                                                                onClick={() => {
                                                                    setProjectLocation(true),
                                                                        setProjectRoleID(item?.userId);
                                                                }}
                                                            >
                                                                <div className="flex ">
                                                                    <div className="flex w-[160px]  justify-between  gap-2 ">
                                                                        {item?.positions.length > 0 ? (
                                                                            <p>
                                                                                {item?.positions
                                                                                    ?.map((item) => item.positionName)
                                                                                    .join(', ')
                                                                                    .slice(0, 15) +
                                                                                    (item?.positions
                                                                                        .map(
                                                                                            (item) => item.positionName
                                                                                        )
                                                                                        .join(', ').length > 15
                                                                                        ? '...'
                                                                                        : '')}
                                                                            </p>
                                                                        ) : (
                                                                            <p className="font-normal text-[#787878]">
                                                                                Select Position
                                                                            </p>
                                                                        )}
                                                                        <Icon name="down" />
                                                                    </div>
                                                                </div>
                                                                <Icon
                                                                    name="chevron_down"
                                                                    className="stroke-[#383737]"
                                                                />
                                                            </div>
                                                        </div>
                                                        {projectLocation === true && item?.userId === projectRoleId && (
                                                            <div
                                                                className="absolute    z-[1050] w-[180px]  overflow-auto bg-white p-3 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.24)]"
                                                                ref={modalRef}
                                                            >
                                                                {dataPosition?.getPosition?.positions?.map(
                                                                    (role, index) => {
                                                                        let exist = item?.positions?.some(
                                                                            (item) =>
                                                                                item?.positionId === role?.positionId
                                                                        );
                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                className={`mt-2 flex gap-3 p-2 hover:bg-[#D9D9D9]`}
                                                                                onClick={() => {
                                                                                    updateRole(
                                                                                        item.userId,
                                                                                        item.roleTestPlan,
                                                                                        role
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {exist ? (
                                                                                    <Icon
                                                                                        name="checkbox_input_2"
                                                                                        className="  "
                                                                                    />
                                                                                ) : (
                                                                                    <Icon
                                                                                        name="checkbox_input_1"
                                                                                        className="  "
                                                                                    />
                                                                                )}
                                                                                <p>{role?.positionName}</p>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            )}
                        </table>
                    </div>

                    {/* Danh sách member bị trống */}
                    {listMember.length === 0 && (
                        <div className="mt-6 flex w-full justify-center">
                            <Empty
                                notFoundMessage={`The member list is empty. Add members to carry out the Test Plan.`}
                            />
                        </div>
                    )}
                    {/* End */}
                </div>
            </div>

            <DeleteMember
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleDeletMember={handleDeletMember}
                listMember={listMember}
            />
        </div>
    );
};

export default CreateMember;
