import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import ToastCustom from '../components/common/ToastCustom';

const PrivateRoute = (props) => {
  const { userInfo, checkPermissions } = useGlobalContext();
  const [authenticated, setAuthenticated] = useState(true);

  const handleCheckToken = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/auth/valid-accessToken`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      setAuthenticated(true);
    } catch (error) {
      setAuthenticated(false);
      toast.custom((t) => <ToastCustom status={false} title={'Error calling protected API'} message="" t={t} />);
    }
  };

  useEffect(() => {
    if (userInfo?.token) {
      handleCheckToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token]);

  if (!authenticated) {
    return <Navigate to={'/login'} />;
  } else if (checkPermissions === true) {
    return props.children;
  } else if (checkPermissions === false) {
    return <Navigate to={'/profile'} />;
  }
};

export default PrivateRoute;
