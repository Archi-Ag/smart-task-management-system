import axios from "axios";

const api = axios.create({
  baseURL: "https://reimagined-sniffle-x5w4v6xxppgj36wqx-5000.app.github.dev/api"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;