import { apiRequest } from './api';

export async function getWeather(destinationName) {
  return apiRequest(`/weather/${encodeURIComponent(destinationName)}/`);
}
