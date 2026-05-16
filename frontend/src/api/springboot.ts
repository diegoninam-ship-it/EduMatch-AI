import axios from 'axios';

const springApi = axios.create({
  baseURL: 'http://127.0.0.1:8080',
});

springApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

springApi.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.replace('/');
    }
    return Promise.reject(error);
  }
);

export default springApi;
