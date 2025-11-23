import axios from "axios";
import Cookies from 'js-cookie';

export const KEY = {
    auth_token : 'auth_token',
    user_info : 'user_info',
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(KEY.auth_token);
    if (process.env.NODE_ENV === 'development') {
      console.debug('[api] request token', { url: config.url, token });
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.NODE_ENV === 'development') {
      console.debug('[api] request headers', config.headers);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // If the backend indicates the token is invalid or expired, clear local auth
//     // and forward the user to login. This protects routes and keeps UI state in sync.
//     const status = error?.response?.status;
//     if (status === 401) {
//       Cookies.remove(KEY.auth_token);
//       Cookies.remove(KEY.user_info);

//       if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
//         // Use location replace to avoid history spam
//         window.location.replace('/login');
//       }
//     }

//     // Helpful debug log while in development
//     if (process.env.NODE_ENV === 'development' && error.response) {
//       console.log('API Error Response:', {
//         status: error.response.status,
//         data: error.response.data,
//         url: error.config?.url,
//       });
//     }

//     return Promise.reject(error);
//   }
// );

export default api;