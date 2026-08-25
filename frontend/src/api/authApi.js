import axiosClient from "./axiosClient.js";

export const authApi = {
  register: (payload) => axiosClient.post("/auth/register", payload),
  login: (payload) => axiosClient.post("/auth/login", payload),
  forgotPassword: (email) => axiosClient.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    axiosClient.post("/auth/reset-password", { token, new_password: newPassword }),
  getProfile: () => axiosClient.get("/auth/me"),
};
