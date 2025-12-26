import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const getClientId = () => {
    let id = localStorage.getItem('oasis_client_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('oasis_client_id', id);
    }
    return id;
};

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const clientId = getClientId();
    if (config.method === 'get') {
        config.params = { ...config.params, client_id: clientId };
    } else {
        config.data = { ...config.data, client_id: clientId };
    }
    return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);
