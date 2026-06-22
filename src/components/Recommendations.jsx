import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations } from '../services/tripService';
import { formatCurrency, formatRating, errorStyle, loadingStyle } from '../utils/helpers';

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (err) {
        setError(err.message || 'Failed to load recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        Recommended Trips
      </h1>

      {loading && <p style={loadingStyle}>Loading recommendations...</p>}
      {error && <div style={{ ...errorStyle, maxWidth: '500px', margin: '0 auto' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {recommendations.map((trip) => (
          <div key={trip.id} style={{ border: '1px solid gray', padding: '20px', width: '250px' }}>
            <h3>{trip.name}</h3>
            <p>{trip.duration_days} Days</p>
            <p>Budget: {formatCurrency(trip.budget)}</p>
            <p>{formatRating(trip.rating)}</p>
          </div>
        ))}
      </div>

      {!loading && !error && recommendations.length === 0 && (
        <p style={{ textAlign: 'center' }}>No recommendations available.</p>
      )}

      <Link to="/hotels">
        <button style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          View Hotels
        </button>
      </Link>
    </div>
  );
}

export default Recommendations;
