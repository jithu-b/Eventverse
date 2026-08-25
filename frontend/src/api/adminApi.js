import axiosClient from "./axiosClient.js";

export const adminApi = {
  getOverview: () => axiosClient.get("/admin/overview"),
  listUsers: (params = {}) => axiosClient.get("/admin/users", { params }),
  updateUserRole: (userId, role) => axiosClient.put(`/admin/users/${userId}/role`, { role }),
  deactivateUser: (userId) => axiosClient.delete(`/admin/users/${userId}`),
  listAllEvents: (params = {}) => axiosClient.get("/admin/events", { params }),
  deleteAnyEvent: (eventId) => axiosClient.delete(`/admin/events/${eventId}`),
  listAllQuizzes: () => axiosClient.get("/admin/quizzes"),
  getReports: (params = {}) => axiosClient.get("/admin/reports", { params }),
  exportReport: (type) => axiosClient.get(`/admin/reports/export`, { params: { type }, responseType: "blob" }),
};
