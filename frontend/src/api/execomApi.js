import axiosClient from "./axiosClient.js";

export const execomApi = {
  list: () => axiosClient.get("/execom"),
  create: (formData) =>
    axiosClient.post("/execom", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (memberId, formData) =>
    axiosClient.put(`/execom/${memberId}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (memberId) => axiosClient.delete(`/execom/${memberId}`),
};
