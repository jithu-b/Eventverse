import axiosClient from "./axiosClient.js";

export const attendanceApi = {
  checkIn: (eventId, qrCode) => axiosClient.post(`/attendance/event/${eventId}/check-in`, { code: qrCode }),

  getEventAttendance: (eventId) => axiosClient.get(`/attendance/event/${eventId}`),

  markManual: (eventId, userId) =>
    axiosClient.post(`/attendance/event/${eventId}/manual`, { user_id: userId }),
};