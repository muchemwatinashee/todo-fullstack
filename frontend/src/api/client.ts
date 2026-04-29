import axios from "axios";

// This is the "bridge" to your Python FastAPI backend
const client = axios.create({
  baseURL: "http://localhost:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});

// This part handles the "Authorization: Bearer" requirement from your task
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;