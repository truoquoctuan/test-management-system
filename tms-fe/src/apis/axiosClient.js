import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// eslint-disable-next-line no-undef
const axiosClient = axios.create({ baseURL: process.env.REACT_APP_SERVICE_CHECK_AUTH });

axiosClient.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = jwtDecode(token);

            if (decodedToken && decodedToken.exp) {
                const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại
                if (currentTime > decodedToken.exp) {
                    // Token đã hết hạn, đăng xuất người dùng và chuyển hướng đến trang đăng nhập
                    localStorage.removeItem('token');
                    window.location.href = '#/login';
                } else {
                    // Nếu token chưa hết hạn, thêm Authorization header vào yêu cầu
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
