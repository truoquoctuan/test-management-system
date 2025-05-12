import React, { useEffect, useState } from 'react';
import ModalComponent from '../common/Modal';
import Icon from '../../icons/Icon';
import account from '../../services/apis/Account';
import { toast } from 'sonner';
import ToastCustom from '../common/ToastCustom';
import AttachFile from '../../components/files/File';

const ModalInviteMember = ({ isOpenInvite, setIsOpenInvite, workspaceId, setCallback, callBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm gọi API lấy danh sách thành viên
  const getListUser = async () => {
    try {
      const data = await account.getListMemberNotJoined(workspaceId, 1, 50, searchTerm);
      setSuggestions(data.data.dataList);
      setIsLoading(false);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={error?.message} message="" t={t} />);
    }
  };

  // Xử lý tìm kiếm khi nhập từ khóa
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);

    const debounce = setTimeout(getListUser, 500); // Thêm debounce để giảm số lần gọi API
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, workspaceId]);

  // Thêm thành viên vào danh sách đã chọn
  const handleSelectMember = (member) => {
    if (!selectedMembers.find((m) => m.userId === member.userId)) {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  // Xóa thành viên khỏi danh sách
  const handleRemoveMember = (memberId) => {
    setSelectedMembers(selectedMembers.filter((m) => m.userId !== memberId));
  };

  // Xử lý mời thành viên
  const handleInvite = async () => {
    const data = {
      groupId: workspaceId,
      userIdArr: selectedMembers?.map((item) => item.userId),
    };
    try {
      await account.addMember(data);
      setCallback(!callBack);
      setIsOpenInvite(false);
      toast.custom((t) => (
        <ToastCustom
          status={true}
          title="Member Created!"
          message="The member is now ready to access the apps in the workspace."
          t={t}
        />
      ));
    } catch (error) {
      console.log(error);
    }
    // Gửi dữ liệu qua API tại đây
  };

  return (
    <div>
      <ModalComponent isOpen={isOpenInvite} setIsOpen={setIsOpenInvite}>
        <div className="w-[600px] min-h-[360px] max-h-[600px] p-6">
          <div className="flex justify-between">
            <p className="font-semibold text-lg text-[#172B4D]">Invite Member </p>
            <div
              onClick={() => {
                setSearchTerm('');
                setSelectedMembers([]);
                setIsOpenInvite(false);
              }}
            >
              <Icon name="Close" />
            </div>
          </div>
          <div className=" mt-6 ">
            <div>
              <label className="block mb-2 text-[#172B4D]">Username, name or email address</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to search..."
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none"
                />
                <p className="text-[#626F86] text-xs pt-2">Select from usernames or enter email addresses.</p>

                {!isLoading && searchTerm && (
                  <div
                    className={`absolute left-0 right-0 z-[999]  top-11 bg-white rounded-lg ${suggestions.length === 0 ? 'h-0' : 'min-h-[30px]  border max-h-[180px]'} mt-2  custom-scroll-y`}
                  >
                    <div>
                      {suggestions
                        .filter((s) => !selectedMembers.some((member) => member.userId === s.userId))
                        .map((s) => (
                          <div
                            key={s.userId}
                            className="px-4 py-2 cursor-pointer hover:bg-slate-100 flex gap-3 ite"
                            onClick={() => {
                              handleSelectMember(s);
                              setSearchTerm('');
                            }}
                          >
                            <div className="h-full">
                              <AttachFile
                                attachType="WorkspaceAvatar"
                                entity="user"
                                seq={s?.userId}
                                register={null}
                                viewMode={false}
                                defaultImage={s?.username}
                                mode={'member' + s?.userId}
                                className="w-8 h-8 rounded border-[#091E4224] border"
                              />
                            </div>

                            <div>
                              <p className="text-[#172B4D] font-medium text-sm">
                                {s.firstName} {s.lastName}
                              </p>
                              <p className="text-gray-400 text-xs">@{s.userName}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              {selectedMembers.map((member) => (
                <div
                  key={member.userId}
                  className="inline-flex items-center bg-[#F1F2F4] gap-2  text-[#44546F] px-3  rounded-md mr-2 mb-2"
                >
                  <p className="font-medium">
                    {member.firstName} {member.lastName}
                  </p>
                  <button onClick={() => handleRemoveMember(member.userId)} className=" mt-2">
                    <Icon name="Close" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block mb-2">Role</label>
              <p className="w-full px-4 py-2 border border-gray-700 bg-gray-100 rounded-lg">User</p>
            </div>

            <div className="mt-6 flex justify-end gap-4 ">
              <button
                className="ml-4 px-4 py-2  rounded-lg  text-base"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMembers([]);
                  setIsOpenInvite(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={selectedMembers.length === 0 ? null : handleInvite}
                className={`px-4 py-2 text-base  rounded-lg text-white ${selectedMembers.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0C66E4] hover:bg-blue-500'}`}
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default ModalInviteMember;
