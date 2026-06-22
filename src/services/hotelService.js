import { apiRequest } from './api';

export async function getHotels(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.destination_name) {
    searchParams.set('destination_name', params.destination_name);
  }
  if (params.destination) {
    searchParams.set('destination', params.destination);
  }
  const query = searchParams.toString();
  return apiRequest(`/hotels/${query ? `?${query}` : ''}`);
}

export async function bookHotel(hotelId, tripId) {
  return apiRequest(`/hotels/${hotelId}/book/`, {
    method: 'POST',
    body: { trip_id: tripId },
  });
}
