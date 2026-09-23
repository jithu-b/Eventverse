import axiosClient from "./axiosClient.js";

export const adminApi = {
  getOverview: () => axiosClient.get("/admin/overview"),
  getActivity: () => axiosClient.get("/admin/activity"),

  // Users
  listUsers: (params = {}) => axiosClient.get("/admin/users", { params }),
  updateUserRole: (userId, role) => axiosClient.put(`/admin/users/${userId}/role`, { role }),
  deactivateUser: (userId) => axiosClient.delete(`/admin/users/${userId}`),

  // Events
  listAllEvents: (params = {}) => axiosClient.get("/admin/events", { params }),
  deleteAnyEvent: (eventId) => axiosClient.delete(`/admin/events/${eventId}`),
  updateEventSpots: (eventId, registration_limit) => axiosClient.patch(`/admin/events/${eventId}/spots`, { registration_limit }),

  // Quizzes
  listAllQuizzes: () => axiosClient.get("/admin/quizzes"),

  // Reports
  getReports: (params = {}) => axiosClient.get("/admin/reports", { params }),
  exportReport: (type) =>
    axiosClient.get(`/admin/reports/export`, { params: { type }, responseType: "blob" }),
};