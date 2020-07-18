import axios from 'axios';

const api = axios.create({
    baseURL:
        process.env.NODE_ENV === 'production'
            ? process.env.REACT_APP_PRODUCTION_API_URL
            : process.env.REACT_APP_DEV_API_URL,
});

export default api;
