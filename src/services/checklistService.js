import { apiRequest } from './api';

export async function getChecklist(tripId) {
  return apiRequest(`/checklist/?trip=${tripId}`);
}

export async function createChecklistItem({ trip, item_name }) {
  return apiRequest('/checklist/', {
    method: 'POST',
    body: { trip, item_name },
  });
}

export async function updateChecklistItem(itemId, data) {
  return apiRequest(`/checklist/${itemId}/`, {
    method: 'PATCH',
    body: data,
  });
}
