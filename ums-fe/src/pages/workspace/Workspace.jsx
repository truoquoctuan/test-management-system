import React, { useEffect, useState } from 'react';
import Hand from '../../assets/images/hand.svg';
import Icon from '../../icons/Icon';
import Service from '../../components/workspace/Service';
import { useGlobalContext } from '../../context/Context';
import account from '../../services/apis/Account';
import { toast } from 'sonner';
import ToastCustom from '../../components/common/ToastCustom';
const Workspace = () => {
  const { infoWorkSpace, tokenInformation } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [listMember, setListMember] = useState(null);

  const countService = tokenInformation?.aud?.filter((service) =>
    ['bzt-service', 'bzw-service', 'bzq-service'].includes(service)
  );

  const getListMember = async () => {
    try {
      const data = await account.getListmemberWorkSpace(infoWorkSpace.workspaceId);
      setListMember(data.data);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title="An error occurred." message="" t={t} />);
    }
  };

  useEffect(() => {
    if (infoWorkSpace) {
      getListMember();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoWorkSpace]);

  useEffect(() => {
    setLoading(true);
    if (infoWorkSpace) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [infoWorkSpace]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-6  h-[90vh] overflow-y-auto  bg-white animate__animated animate__fadeIn`}>
      <div className="flex gap-3 justify-center mt-6">
        <img src={Hand} alt="" />{' '}
        <p className="text-text-200 font-bold text-2xl">Welcome to Arne Enterprise’s Workspace!</p>
      </div>
      <div className="flex justify-center">
        <div className="border p-3 flex justify-center rounded-full gap-6 w-[370px]">
          {/* <div className="flex gap-3 border-r pr-6">
            <Icon name="Server" />
            <p>
              <span className="text-[#0055CC] font-semibold text-[20px]">{countService?.length}</span> Apps
            </p>
          </div> */}
          <div className="flex gap-3">
            <Icon name="Users" />
            <p>
              <span className="text-[#0055CC] font-semibold text-[20px]">{listMember?.totalItems} </span> Accounts
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-[80%] m-auto bg-[#F3F0FF] h-[94px] px-8 py-4 rounded-lg items-center">
        <div>
          <p className="text-[#172B4D] font-semibold text-base">See what's happening in your workspace at a glance</p>
          <p className="font-normal text-sm text-[#172B4D]">
            Efficiently manage user accounts and system access, allowing you to track and update any changes across your
            workspace.
          </p>
        </div>
        <div>
          <Icon name="Visa" />
        </div>
      </div>
      <div className="w-[80%] m-auto">
        <Service countService={countService} />
      </div>
    </div>
  );
};

export default Workspace;
