import axiosClient from "./axiosClient.js";

export const eventApi = {
  list: (params = {}) => axiosClient.get("/events", { params }),
  getById: (id) => axiosClient.get(`/events/${id}`),
  create: (formData) =>
    axiosClient.post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, formData) =>
    axiosClient.put(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (id) => axiosClient.delete(`/events/${id}`),
  register: (id) => axiosClient.post(`/events/${id}/register`),
  myRegistrations: () => axiosClient.get("/events/my-registrations"),
  organizedByMe: () => axiosClient.get("/events/organized-by-me"),
  stats: () => axiosClient.get("/events/stats"),
};
