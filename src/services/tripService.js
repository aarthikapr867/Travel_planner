import { apiRequest } from './api';

export async function generatePlan({ destination, days, budget, travel_type }) {
  return apiRequest('/planner/generate/', {
    method: 'POST',
    body: { destination, days, budget, travel_type },
  });
}

export async function getRecommendations() {
  return apiRequest('/trips/recommendations/');
}

export async function getTripSummary(tripId) {
  return apiRequest(`/trips/${tripId}/summary/`);
}

export async function confirmTrip(tripId) {
  return apiRequest(`/trips/${tripId}/confirm/`, { method: 'POST' });
}
