import axios from 'axios';

const baseURL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({ baseURL });

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('eventverse_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('eventverse_token');
      localStorage.removeItem('eventverse_user');
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
