import axios from 'axios';
import axiosClient from '../axiosClient';

const auth = {
    // Api kiểm tra đăng nhập
    checkLogin: () => {
        const url = '';
        return axiosClient.get(url);
    },
    // Api đăng nhập
    login: (params) => {
        // eslint-disable-next-line no-undef
        return axios.post(process.env.REACT_APP_SERVICE_AUTH, params);
    },
    searchMember: (userId, userName) => {
        const url = `/user/selectUserByDisable?userId=${userId}&name=${userName}`;
        return axiosClient.get(url);
    }
};
export default auth;
