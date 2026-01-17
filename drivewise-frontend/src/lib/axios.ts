import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("drivewise_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Let axios set Content-Type for FormData automatically
  if (config.data instanceof FormData) {
    // do not set content-type here
    if (config.headers && config.headers['Content-Type']) delete config.headers['Content-Type'];
  }
  return config;
});

export default api;
