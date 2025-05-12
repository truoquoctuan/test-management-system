import axios from 'axios';
import keycloak from '../keycloak/Keycloak';
import { backEndUrlKeyCloak } from './BackEndUrl';

const axiosClientKeyCloak = axios.create({ baseURL: backEndUrlKeyCloak });
axiosClientKeyCloak.interceptors.request.use(
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

export default axiosClientKeyCloak;
