// // services/serviceApi.js
// import axios from 'axios';

// const API_BASE = 'http://your-backend/api/admin';

// const getToken = () => localStorage.getItem('token');

// const api = axios.create({
//   baseURL: API_BASE,
// });

// api.interceptors.request.use(config => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const serviceApi = {
//   getAll: () => api.get('/services'),
  
//   getById: (id) => api.get(`/services/${id}`),
  
//   create: (data) => api.post('/services', data),
  
//   update: (id, data) => api.put(`/services/${id}`, data),
  
//   delete: (id) => api.delete(`/services/${id}`),
  
//   getActive: () => api.get('/services/active')
// };