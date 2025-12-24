import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
    (config) => {
        const userString = localStorage.getItem('mock_user');
        if (userString) {
            // const user = JSON.parse(userString);
            // In a real app we'd store the token separately, but for now let's assume 
            // we can get it or we just send the user ID as a header for mock auth if needed.
            // Ideally, the login response gives a token we store in localStorage.
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
