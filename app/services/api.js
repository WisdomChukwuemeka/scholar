import axios from 'axios';

// const myBaseUrl = 'http://localhost:8000/api';
const myBaseUrl =  process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: myBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Django TokenAuthentication
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const AuthAPI = {
  register: (formData) => api.post('/register/', formData),
  login: (credentials) => api.post('/login/', credentials),
};

export const PasscodeAPI = {
  verify: (data) => api.post('/verify-passcode/', data), // ✅ for editors before login
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
  // 👍 Like publication
  like: (publicationId) =>
    api.patch(`/publications/${publicationId}/views/`, { action: 'like' }),
     // Accepts optional query params (like ?page=1 or ?keywords=research)
  list: (params = "") => api.get(`/publications/${params}`),

  // 👎 Dislike publication
  dislike: (publicationId) =>
    api.patch(`/publications/${publicationId}/views/`, { action: 'dislike' }),

  // (Optional) fetch user's view record for a publication
  detail: (publicationId) => api.get(`/publications/${publicationId}/views/me/`),
};

export const NotificationAPI = {
    list: (params = "") => api.get(`/notifications/${params}`),
    unread: () => api.get('/notifications/unread/'),
    markRead: (id) => api.patch(`/notifications/${id}/read/`, { is_read: true }),
    markAllRead: () => api.patch('/notifications/mark-all-read/'),
};

export default api;