import axios from 'axios';
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});
client.interceptors.request.use(config => config, error => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
});
client.interceptors.response.use(response => response, error => {
    if (error.response) {
        const { status, data } = error.response;
        console.error(`[API] ${status} ${error.config?.url}:`, data);
    }
    else {
        console.error('[API] Network error:', error.message);
    }
    return Promise.reject(error);
});
export default client;
