import axios from 'axios';
import { useAuthStore } from './auth';

const PRIMARY_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const FALLBACK_API_URL = process.env.NEXT_PUBLIC_FALLBACK_API_URL;

export const api = axios.create({
    baseURL: PRIMARY_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is related to network (Render down) or server error (502, 503, etc)
        // and we have a fallback URL defined, and we haven't already retried using fallback
        if (!originalRequest._retry && FALLBACK_API_URL && (!error.response || error.response.status >= 500)) {
            originalRequest._retry = true;
            console.log(`Primary API failed. Switching to fallback API: ${FALLBACK_API_URL}`);
            
            // Override the base URL to use the fallback API
            originalRequest.baseURL = FALLBACK_API_URL;
            
            // Re-run the request
            return api(originalRequest);
        }

        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);
