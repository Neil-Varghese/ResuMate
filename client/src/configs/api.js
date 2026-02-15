import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL || 'https://resumate-server-js52.onrender.com';

console.log('API Base URL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
})

export default api;