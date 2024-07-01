import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // 根据你的服务器地址进行修改
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
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

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 可以在这里添加登出逻辑，比如重定向到登录页
      // window.location.href = "/authentication/sign-in";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
