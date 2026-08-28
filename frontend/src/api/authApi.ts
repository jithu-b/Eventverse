import axiosClient from './axiosClient';

export const authApi = {
  register: (payload: { name: string; email: string; password: string; role?: string }) =>
    axiosClient.post('/auth/register', payload),
  login: (payload: { email: string; password: string }) =>
    axiosClient.post('/auth/login', payload),
  me: () => axiosClient.get('/auth/me'),
};
