import axiosClient from "./axiosClient.js";

export const leaderboardApi = {
  getEventLeaderboard: (eventId) => axiosClient.get(`/leaderboard/event/${eventId}`),
  getQuizLeaderboard: (quizId) => axiosClient.get(`/leaderboard/quiz/${quizId}`),
  getOverallLeaderboard: (eventId) => axiosClient.get(`/leaderboard/overall/${eventId}`),
};
