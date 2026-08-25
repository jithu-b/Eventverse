import axiosClient from "./axiosClient.js";

export const photoApi = {
  list: (eventId) =>
    axiosClient.get("/photos", { params: eventId ? { event_id: eventId } : {} }),
  upload: (formData) =>
    axiosClient.post("/photos", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (photoId) => axiosClient.delete(`/photos/${photoId}`),
};
