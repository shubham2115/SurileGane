import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authAPI = {
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_URL}/auth/login`, data),
};

export const songsAPI = {
  getAll: () => axios.get(`${API_URL}/songs`, { headers: getAuthHeader() }),
  getOne: (id) => axios.get(`${API_URL}/songs/${id}`, { headers: getAuthHeader() }),
  upload: (formData) => axios.post(`${API_URL}/songs`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
  }),
  uploadCover: (id, formData) => axios.post(`${API_URL}/songs/${id}/cover`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => axios.put(`${API_URL}/songs/${id}`, data, { headers: getAuthHeader() }),
  delete: (id) => axios.delete(`${API_URL}/songs/${id}`, { headers: getAuthHeader() }),
  getStreamUrl: (id) => `${API_URL}/songs/${id}/stream`,
};

export default { authAPI, songsAPI };
