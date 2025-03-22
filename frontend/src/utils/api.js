import axios from 'axios';
import { getAuthHeader } from './auth';
import getBackendUrl from './checkBackend';

const API_URL = await getBackendUrl();
// console.log("API URL",API_URL);

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeader();
    if (headers) {
      config.headers = { ...config.headers, ...headers };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;