const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const clearToken = () => localStorage.removeItem('authToken');

export const getCurrentTripId = () => localStorage.getItem('currentTripId');
export const setCurrentTripId = (id) => localStorage.setItem('currentTripId', String(id));
export const clearCurrentTripId = () => localStorage.removeItem('currentTripId');

async function parseResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message =
      data.detail ||
      Object.values(data).flat().join(', ') ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, isFormData = false } = options;
  const headers = {};

  if (!isFormData && body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response);
}
