import { apiRequest } from './api';

export async function getJournals() {
  return apiRequest('/journals/');
}

export async function createJournal({ title, notes, trip, image }) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('notes', notes);
  if (trip) {
    formData.append('trip', trip);
  }
  if (image) {
    formData.append('image', image);
  }

  return apiRequest('/journals/', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}
