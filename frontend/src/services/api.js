import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-task-management-api-v9fl.onrender.com/api"
  //baseURL : "https://glowing-space-waddle-qv9wq6j7v5p6f4474-5000.app.github.dev/api"
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