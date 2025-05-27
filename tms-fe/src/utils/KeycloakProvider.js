import { useGlobalContext } from 'context/Context';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import keycloak from 'service/keycloak/Keycloak';

const KeycloakProvider = ({ children }) => {
    const { setUserInfo, setRoleUser } = useGlobalContext();

    const [keycloakInstance, setKeycloakInstance] = useState(false);
    //   const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra tài khoản người dùng đã đăng nhập hãy chưa đăng nhập
    useEffect(() => {
        const currentPath = window.location.pathname; // Lấy đường dẫn hiện tại

        keycloak
            .init({
                onLoad: 'check-sso',
                checkLoginIframe: false,
                checkLoginIframeInterval: 5
            })
            .then((authenticated) => {
                // setAuthenticated(authenticated);
                setTimeout(() => {
                    setKeycloakInstance(keycloak);
                    console.log('Keycloak instance:', keycloak.tokenParsed);
                    const data = {
                        userID: keycloak?.subject,
                        fullName: keycloak?.tokenParsed?.name,
                        userName: keycloak?.tokenParsed?.preferred_username,
                        email: keycloak?.tokenParsed?.email,
                        gender: keycloak?.tokenParsed?.gender,
                        token: keycloak?.token
                    };
                    setUserInfo(data);
                    const roleWorkSpaceAdmin = keycloak?.realmAccess?.roles.filter(
                        (item) => item === 'workspace_admin'
                    );
                    if (roleWorkSpaceAdmin) {
                        setRoleUser(roleWorkSpaceAdmin[0] === 'workspace_admin' && 'ROLE_ADMIN');
                    }
                }, 500);
                navigate(currentPath);
                if (!authenticated) {
                    navigate('/login');
                }
            })
            .catch((err) => {
                setKeycloakInstance(err);
                navigate('/notfound');
            });
    }, []);

    setInterval(() => {
        keycloak
            .updateToken(30)
            .then((refreshed) => {
                if (refreshed) {
                    console.log('Token refreshed');
                }
            })
            .catch(() => {
                console.error('Failed to refresh token');
            });
    }, 60000);

    if (keycloakInstance === false) {
        return (
            <div className="flex h-[100vh] items-center justify-center">
                <div className="loader"></div>{' '}
            </div>
        );
    }

    return <div>{children}</div>;
};

export default KeycloakProvider;
