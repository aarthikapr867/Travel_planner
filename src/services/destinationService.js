import { apiRequest } from './api';

export async function getFeaturedDestinations() {
  return apiRequest('/destinations/featured/');
}

export async function getCategories() {
  return apiRequest('/destinations/categories/');
}

export async function searchDestinations(query) {
  return apiRequest(`/destinations/?search=${encodeURIComponent(query)}`);
}
