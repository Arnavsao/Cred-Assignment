import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userAPI = {
  create: (data) => api.post('/users', data),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Group API
export const groupAPI = {
  create: (data) => api.post('/groups', data),
  getAll: () => api.get('/groups'),
  getById: (id) => api.get(`/groups/${id}`),
  getUserGroups: (userId) => api.get(`/groups/user/${userId}`),
  addMember: (id, data) => api.post(`/groups/${id}/members`, data),
  removeMember: (id, data) => api.delete(`/groups/${id}/members`, { data }),
  delete: (id) => api.delete(`/groups/${id}`),
};

// Expense API
export const expenseAPI = {
  create: (data) => api.post('/expenses', data),
  getAll: () => api.get('/expenses'),
  getById: (id) => api.get(`/expenses/${id}`),
  getByGroup: (groupId) => api.get(`/expenses/group/${groupId}`),
  getByUser: (userId) => api.get(`/expenses/user/${userId}`),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id, data) => api.delete(`/expenses/${id}`, { data }),
};

// Balance API
export const balanceAPI = {
  getAll: () => api.get('/balances'),
  getByGroup: (groupId) => api.get(`/balances/group/${groupId}`),
  getByUser: (userId) => api.get(`/balances/user/${userId}`),
  getUserBalanceInGroup: (userId, groupId) =>
    api.get(`/balances/user/${userId}/group/${groupId}`),
};

// Settlement API
export const settlementAPI = {
  create: (data) => api.post('/settlements', data),
  getAll: () => api.get('/settlements'),
  getByGroup: (groupId) => api.get(`/settlements/group/${groupId}`),
  getByUser: (userId) => api.get(`/settlements/user/${userId}`),
  settleAll: (groupId) => api.post(`/settlements/group/${groupId}/settle-all`),
};

export default api;
