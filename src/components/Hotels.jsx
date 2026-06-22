import React, { useEffect, useState } from 'react';
import hotel from './hotel.jpg';
import { Link } from 'react-router-dom';
import { getHotels, bookHotel } from '../services/hotelService';
import { getCurrentTripId } from '../services/api';
import { formatCurrency, formatRating, errorStyle, successStyle, loadingStyle } from '../utils/helpers';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getHotels();
        setHotels(data);
      } catch (err) {
        setError(err.message || 'Failed to load hotels.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleBook = async (hotelId) => {
    setBookingId(hotelId);
    setError('');
    setSuccess('');

    try {
      const tripId = getCurrentTripId();
      const data = await bookHotel(hotelId, tripId ? Number(tripId) : undefined);
      setSuccess(data.detail || 'Hotel booked successfully!');
    } catch (err) {
      setError(err.message || 'Booking failed. Please login and try again.');
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        Hotel Suggestions
      </h1>

      {loading && <p style={loadingStyle}>Loading hotels...</p>}
      {error && <div style={{ ...errorStyle, maxWidth: '500px', margin: '0 auto' }}>{error}</div>}
      {success && <div style={{ ...successStyle, maxWidth: '500px', margin: '0 auto' }}>{success}</div>}

      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        {hotels.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid gray',
              padding: '20px',
              width: '280px',
              borderRadius: '10px'
            }}
          >
            <img
              src={item.image || hotel}
              alt="Hotel"
              style={{
                width: '100%',
                height: '150px',
                borderRadius: '10px',
                objectFit: 'cover'
              }}
            />

            <h3>{item.name}</h3>
            <p>📍 {item.destination_name}</p>
            <p>{formatCurrency(item.price_per_night)} / Night</p>
            <p>{formatRating(item.rating)}</p>

            <button
              onClick={() => handleBook(item.id)}
              disabled={bookingId === item.id}
              style={{
                backgroundColor: 'purple',
                color: 'white',
                padding: '8px',
                border: 'none',
                borderRadius: '5px',
                cursor: bookingId === item.id ? 'not-allowed' : 'pointer'
              }}
            >
              {bookingId === item.id ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        ))}
      </div>

      {!loading && !error && hotels.length === 0 && (
        <p style={{ textAlign: 'center' }}>No hotels available.</p>
      )}

      <Link to="/budgetcalculator">
        <button style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          Next
        </button>
      </Link>
    </div>
  );
}

export default Hotels;
