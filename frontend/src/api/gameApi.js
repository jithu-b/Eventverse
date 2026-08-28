import axiosClient from "./axiosClient.js";

export const gameApi = {
  getByEvent: (eventId) => axiosClient.get(`/games/event/${eventId}`),

  enableForEvent: (eventId, gameType) =>
    axiosClient.post(`/games/event/${eventId}`, { game_type: gameType }),

  submitScore: (gameId, payload) => axiosClient.post(`/games/${gameId}/score`, payload),

  getMyPersonalBest: (gameId) => axiosClient.get(`/games/${gameId}/my-best`),

  getLeaderboard: (gameId) => axiosClient.get(`/games/${gameId}/leaderboard`),
};