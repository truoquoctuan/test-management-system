import { jwtDecode } from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import workSpace from '../services/apis/WorkSpace';
import { toast } from 'sonner';
import ToastCustom from '../components/common/ToastCustom';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [tokenInformation, setTokenInformation] = useState();
  const [infoWorkSpace, setInfoWorkSpace] = useState();
  const [callBack, setCallback] = useState(false);

  const checkPermissions = tokenInformation?.realm_access?.roles.includes('workspace_admin');

  const handleToken = () => {
    try {
      const decoded = jwtDecode(userInfo?.token);
      setTokenInformation(decoded);
    } catch (error) {
      toast.custom((t) => <ToastCustom status={false} title={'Invalid token'} message="" t={t} />);
    }
  };

  useEffect(() => {
    if (userInfo?.token) {
      handleToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token]);

  const hanldeGetWorkspaceByName = async () => {
    const data = await workSpace.getWorkspaceByName(tokenInformation['group-user'][0].split('/')[1]);
    setInfoWorkSpace(data.data.data);
  };

  useEffect(() => {
    if (tokenInformation) {
      hanldeGetWorkspaceByName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenInformation]);

  return (
    <AppContext.Provider
      value={{
        checkPermissions,
        setUserInfo,
        userInfo,
        tokenInformation,
        infoWorkSpace,
        hanldeGetWorkspaceByName,
        setCallback,
        callBack,
        setInfoWorkSpace,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
