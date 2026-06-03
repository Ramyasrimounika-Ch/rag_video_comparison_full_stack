import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const ingestVideos = (data) =>
  API.post("/ingest", data);

export const chatWithVideos = (data) =>
  API.post("/chat", data);