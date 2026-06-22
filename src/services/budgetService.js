import { apiRequest } from './api';

export async function calculateBudget({ travel_cost, hotel_cost, food_cost, activity_cost, trip_id }) {
  return apiRequest('/budget/calculate/', {
    method: 'POST',
    body: { travel_cost, hotel_cost, food_cost, activity_cost, trip_id },
  });
}
