import React, { useContext, useEffect, useState } from 'react';

import { Client } from '@stomp/stompjs';
import { jwtDecode } from 'jwt-decode';
import keycloak from 'service/keycloak/Keycloak';
import SockJS from 'sockjs-client';
import { NotifyMe } from 'utils/NotifyMe';
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [authenticated, setAuthenticated] = useState(true);

    // eslint-disable-next-line no-unused-vars
    const [roleUser, setRoleUser] = useState('');
    const [checkStatus, setCheckStatus] = useState(null);
    const [checkRoleTestPland, setCheckRoleTestPland] = useState();
    const [dataComment, setDataComment] = useState(null);
    const [testPlanName, setTestPlanName] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [tokenInformation, setTokenInformation] = useState();

    const handleToken = () => {
        try {
            const decoded = jwtDecode(keycloak?.token);
            setTokenInformation(decoded);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (userInfo?.token) {
            handleToken();
        }
    }, [userInfo?.token]);

    const [isSocketNoti, setIsSocketNoti] = useState(false);

    const changeStatusNoti = () => {
        setIsSocketNoti(false);
    };
    const urls = [
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_SERVICE_REPO}?userId=${userInfo?.userID}&token=${userInfo?.token}`,
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_SERVICE_RUN}?userId=${userInfo?.userID}&token=${userInfo?.token}`
    ];

    useEffect(() => {
        if (userInfo?.userID) {
            const stompClients = urls.map((url) => {
                const client = new Client({
                    webSocketFactory: () => new SockJS(url),
                    reconnectDelay: 5000
                });

                client.onConnect = () => {
                    client.subscribe('/user/topic/private-notifications', (commentDto) => {
                        const response = JSON.parse(commentDto.body);
                        JSON.parse(commentDto.body);
                        setIsSocketNoti(true);
                        NotifyMe(response);
                    });
                    client.subscribe('/topic/comment', (commentDto) => {
                        const response = JSON.parse(commentDto.body);
                        JSON.parse(commentDto.body);
                        setIsSocketNoti(true);
                        setDataComment(response);
                    });
                };

                client.onStompError = (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                };

                client.activate();

                return client;
            });

            return () => {
                stompClients.forEach((client) => client.deactivate());
            };
        }
    }, [urls, userInfo?.userID]);

    return (
        <AppContext.Provider
            value={{
                userInfo,
                setUserInfo,
                roleUser,
                isSocketNoti,
                changeStatusNoti,
                checkStatus,
                setCheckStatus,
                setCheckRoleTestPland,
                checkRoleTestPland,
                dataComment,
                setTestPlanName,
                testPlanName,
                setRoleUser,
                authenticated,
                setAuthenticated,
                tokenInformation
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
