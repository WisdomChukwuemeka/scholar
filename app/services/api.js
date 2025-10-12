import axios from 'axios';
import { SecureStorage } from '@/utils/secureStorage';

// Base URL for your backend API
const myBaseUrl = 'http://localhost:8000/api';
// const myBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: myBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 🔐 Security Layer for localStorage ---
// Token getter that protects against SSR and XSS
const getToken = () => {
  try {
    if (typeof window !== "undefined") {
      return SecureStorage.get("access_token"); // <-- Decrypted token
    }
    return null;
  } catch (err) {
    console.warn("Could not get token:", err);
    return null;
  }
};

// Add Authorization header to every request if token exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // For DRF TokenAuthentication
  }
  return config;
});

// --- 🔁 Auto-logout on expired or invalid token ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
      } catch (e) {
        console.warn("Failed to clear localStorage:", e);
      }
      // Optional: redirect user to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- ⏳ Token Expiry Auto-Check (Optional) ---
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// --- 📦 API Endpoints ---
export const AuthAPI = {
  register: (formData) => api.post('/register/', formData),
  login: (credentials) => api.post('/login/', credentials),
};

export const PasscodeAPI = {
  verify: (data) => api.post('/verify-passcode/', data),
};

export const PublicationAPI = {
  list: (params = "") => api.get(`/publications/${params}`),
  create: (data) => api.post('/publications/', data),
  detail: (id) => api.get(`/publications/${id}/`),
  update: (id, data) => api.put(`/publications/${id}/`, data),
  patch: (id, data) => api.patch(`/publications/${id}/`, data),
  delete: (id) => api.delete(`/publications/${id}/`),
  userPublications: (userId) => api.get(`/users/${userId}/publications/`),
};

export const CategoryAPI = {
  list: () => api.get('/categories/'),
  detail: (id) => api.get(`/categories/${id}/`),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.put(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
};

export const ViewsAPI = {
  like: (publicationId) =>
    api.patch(`/publications/${publicationId}/views/`, { action: 'like' }),
  dislike: (publicationId) =>
    api.patch(`/publications/${publicationId}/views/`, { action: 'dislike' }),
  detail: (publicationId) => api.get(`/publications/${publicationId}/views/me/`),
};

export const NotificationAPI = {
  list: (params = "") => api.get(`/notifications/${params}`),
  unread: () => api.get('/notifications/unread/'),
  markRead: (id) => api.patch(`/notifications/${id}/read/`, { is_read: true }),
  markAllRead: () => api.patch('/notifications/mark-all-read/'),
};

export default api;
