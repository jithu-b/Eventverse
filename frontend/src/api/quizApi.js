import axiosClient from "./axiosClient.js";

export const quizApi = {
  getByEvent: (eventId) => axiosClient.get(`/quiz/event/${eventId}`),

  createForEvent: (eventId, payload) => axiosClient.post(`/quiz/event/${eventId}`, payload),

  updateQuiz: (quizId, payload) => axiosClient.put(`/quiz/${quizId}`, payload),

  deleteQuiz: (quizId) => axiosClient.delete(`/quiz/${quizId}`),

  addQuestion: (quizId, payload) => axiosClient.post(`/quiz/${quizId}/questions`, payload),

  updateQuestion: (questionId, payload) => axiosClient.put(`/quiz/questions/${questionId}`, payload),

  deleteQuestion: (questionId) => axiosClient.delete(`/quiz/questions/${questionId}`),

  startAttempt: (quizId) => axiosClient.post(`/quiz/${quizId}/start`),

  submitAttempt: (attemptId, answers) =>
    axiosClient.post(`/quiz/attempts/${attemptId}/submit`, { answers }),

  getResults: (attemptId) => axiosClient.get(`/quiz/attempts/${attemptId}`),

  getLeaderboard: (quizId) => axiosClient.get(`/quiz/${quizId}/leaderboard`),
};