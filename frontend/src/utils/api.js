import axios from 'axios';
import { getAuthHeader } from './auth';
import getBackendUrl from './checkBackend';

let api = null;

const initializeApi = async () => {
  try {
    const API_URL = await getBackendUrl();
    console.log('Using backend URL:', API_URL);

    // Create the axios instance with the resolved API_URL
    api = axios.create({
      baseURL: API_URL,
    });

    // Add interceptors
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
  } catch (error) {
    console.error('Failed to initialize API:', error);
  }
};

// Immediately initialize the API when this file is imported
initializeApi();

// Export the axios instance directly
const getApi = () => {
  if (!api) {
    throw new Error('API instance is not initialized yet. Please wait for initialization.');
  }
  return api;
};

export default getApi;