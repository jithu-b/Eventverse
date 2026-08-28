import axiosClient from "./axiosClient.js";

export const certificateApi = {
  getById: (id) => axiosClient.get(`/certificates/${id}`),

  download: (id) => axiosClient.get(`/certificates/${id}/download`, { responseType: "blob" }),

  getMyCertificates: () => axiosClient.get("/certificates/my-certificates"),

  generateForEvent: (eventId, userId) =>
    axiosClient.post(`/certificates/event/${eventId}/generate`, { user_id: userId }),
};