import { apiRequest, setToken, clearToken } from './api';

export async function register({ username, email, password, dob, mobile }) {
  const data = await apiRequest('/auth/register/', {
    method: 'POST',
    body: { username, email, password, dob, mobile },
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export async function login({ username, password }) {
  const data = await apiRequest('/auth/login/', {
    method: 'POST',
    body: { username, password },
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export async function logout() {
  try {
    await apiRequest('/auth/logout/', { method: 'POST' });
  } finally {
    clearToken();
  }
}

export async function getProfile() {
  return apiRequest('/profile/');
}
