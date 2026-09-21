/** Authentication endpoints. */
import api, { tokenStore } from './api';

export async function login(email, password, honeypot = '') {
  const { data } = await api.post('/auth/login/', {
    email,
    password,
    // Hidden field: only bots fill it in. The API rejects those requests.
    website: honeypot,
  });
  tokenStore.set(data.access);
  return data;
}

export async function logout() {
  try {
    await api.post('/auth/logout/', {});
  } finally {
    tokenStore.clear();
  }
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me/');
  return data;
}

export async function changePassword(payload) {
  const { data } = await api.post('/auth/change-password/', payload);
  return data;
}

export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password/', { email });
  return data;
}

export async function resetPassword(payload) {
  const { data } = await api.post('/auth/reset-password/', payload);
  return data;
}
