import axios from 'axios';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from 'service/keycloak/Keycloak';
import { useGlobalContext } from '../context/Context';

const PrivateRoute = (props) => {
    const { userInfo } = useGlobalContext();
    const { authenticated, setAuthenticated, tokenInformation } = useGlobalContext();

    // eslint-disable-next-line no-prototype-builtins
    const hasBzqService = tokenInformation?.resource_access.hasOwnProperty('bzq-service');

    const handleCheckToken = async () => {
        try {
            // eslint-disable-next-line no-undef
            const { data } = await axios.get(`${process.env.REACT_APP_SERVICE_CHECK_AUTH}/${userInfo?.userID}`, {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`
                }
            });

            setAuthenticated(data);
        } catch (error) {
            setAuthenticated(false);
        }
    };
    useEffect(() => {
        let interval;

        if (authenticated) {
            interval = setInterval(() => {
                keycloak.loadUserProfile().catch(() => {
                    keycloak.logout({ redirectUri: window.location.origin }); // Đăng xuất khỏi hệ thống nếu phiên hết hạn
                });
            }, 10000); // Kiểm tra trạng thái mỗi 10 giây
        }

        return () => clearInterval(interval); // Dọn dẹp interval khi unmount
    }, [authenticated]);

    useEffect(() => {
        if (userInfo?.token) {
            handleCheckToken();
        }
    }, [userInfo?.token]);

    if (!authenticated && !hasBzqService) {
        return <Navigate to={'/login'} />;
    } else {
        return props.children;
    }
};

export default PrivateRoute;
