/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import keycloak from '../services/keycloak/Keycloak';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';
import ToastCustom from '../components/common/ToastCustom';
import { toast } from 'sonner';

const KeycloakProvider = ({ children }) => {
  const { setUserInfo } = useGlobalContext();
  const [keycloakInstance, setKeycloakInstance] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra tài khoản người dùng đã đăng nhập hãy chưa đăng nhập
  useEffect(() => {
    const currentPath = window.location.pathname; // Lấy đường dẫn hiện tại
    keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: true,
      })
      .then((authenticated) => {
        setAuthenticated(authenticated);
        setTimeout(() => {
          setKeycloakInstance(keycloak);
          setUserInfo(keycloak);
        }, 500);
        navigate(currentPath);
        if (!authenticated) {
          navigate('/login');
        }
      })
      .catch((err) => {
        toast.custom((t) => <ToastCustom status={false} title={'Keycloak initialization failed'} message="" t={t} />);
        setKeycloakInstance(err);
        navigate('/notfound');
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  setInterval(() => {
    keycloak
      .updateToken(30)
      .then((refreshed) => {
        if (refreshed) {
          console.log('Token refreshed:', keycloak.token);
        }
      })
      .catch(() => {
        console.error('Failed to refresh token');
      });
  }, 60000);

  if (keycloakInstance === false) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <div className="loader"></div>{' '}
      </div>
    );
  }

  return <div>{children}</div>;
};

export default KeycloakProvider;
