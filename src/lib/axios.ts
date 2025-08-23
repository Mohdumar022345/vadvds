import Axios, { AxiosError } from "axios";

const axios = Axios.create({
  baseURL: "/", // Your API base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 2 minute timeout for AI responses
});

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("supabase_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axios;

