import axios from 'axios';
import keycloak from '../keycloak/Keycloak';
import { backEndUrl } from './BackEndUrl';

const axiosClient = axios.create({ baseURL: backEndUrl });
axiosClient.interceptors.request.use(
  async (config) => {
    if (keycloak?.token) {
      // Nếu token chưa hết hạn, thêm Authorization header vào yêu cầu
      config.headers.Authorization = `Bearer ${keycloak?.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
