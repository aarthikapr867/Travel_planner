import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTripSummary, confirmTrip } from '../services/tripService';
import { getCurrentTripId } from '../services/api';
import { formatCurrency, errorStyle, successStyle, loadingStyle } from '../utils/helpers';

function TripSummary() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError('');

      const tripId = getCurrentTripId();
      if (!tripId) {
        setError('No active trip found. Generate a plan first.');
        setLoading(false);
        return;
      }

      try {
        const data = await getTripSummary(tripId);
        setTrip(data);
      } catch (err) {
        setError(err.message || 'Failed to load trip summary. Please login and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handleConfirm = async () => {
    const tripId = getCurrentTripId();
    if (!tripId) return;

    setConfirming(true);
    setError('');
    setSuccess('');

    try {
      const data = await confirmTrip(tripId);
      setTrip(data.trip);
      setSuccess(data.detail || 'Trip confirmed successfully!');
    } catch (err) {
      setError(err.message || 'Failed to confirm trip.');
    } finally {
      setConfirming(false);
    }
  };

  const checkedItems = trip?.checklist_items?.filter((item) => item.is_checked) || [];
  const totalBudget = trip?.budget_detail?.total || trip?.budget;

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        Trip Summary
      </h1>

      {loading && <p style={loadingStyle}>Loading trip summary...</p>}
      {error && <div style={{ ...errorStyle, maxWidth: '500px', margin: '0 auto' }}>{error}</div>}
      {success && <div style={{ ...successStyle, maxWidth: '500px', margin: '0 auto' }}>{success}</div>}

      {trip && (
        <div
          style={{
            width: '500px',
            margin: 'auto',
            border: '1px solid gray',
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <h3>Destination : {trip.destination_name}</h3>
          <h3>Duration : {trip.days} Days</h3>
          <h3>Budget : {formatCurrency(totalBudget)}</h3>

          <hr />

          <h3>Hotel</h3>
          <p>{trip.hotel_name || 'Not selected'}</p>

          <h3>Activities</h3>
          {trip.activities?.length > 0 ? (
            trip.activities.map((activity) => (
              <p key={activity}>• {activity}</p>
            ))
          ) : (
            <p>No activities listed.</p>
          )}

          <h3>Checklist</h3>
          {checkedItems.length > 0 ? (
            checkedItems.map((item) => (
              <p key={item.id}>✓ {item.item_name}</p>
            ))
          ) : (
            <p>No items checked yet.</p>
          )}

          <button
            onClick={handleConfirm}
            disabled={confirming || trip.status === 'confirmed'}
            style={{
              backgroundColor: 'purple',
              color: 'white',
              padding: '10px',
              cursor: confirming ? 'not-allowed' : 'pointer'
            }}
          >
            {trip.status === 'confirmed'
              ? 'Trip Confirmed'
              : confirming
                ? 'Confirming...'
                : 'Confirm Trip'}
          </button>
        </div>
      )}

      <Link to="/profile">
        <button style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          Finish Trip
        </button>
      </Link>
    </div>
  );
}

export default TripSummary;
