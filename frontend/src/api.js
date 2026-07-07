// src/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// 🔐 Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------
export const signup = async (email, password) => {
  const res = await api.post("/auth/signup", { email, password });
  return res.data;
};

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// ---------- CHAT ----------
export const fetchHistory = async () => {
  const res = await api.get("/chat/history");
  return res.data;
};

// Persona support is PRESERVED
export const sendMessage = async (message, image = null, customContext = "") => {
  const payload = { message, image, customContext };
  const res = await api.post("/chat", payload);
  return res.data;
};

export const clearHistory = async () => {
  await api.delete("/chat/history");
};
