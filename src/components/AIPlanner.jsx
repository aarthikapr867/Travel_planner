import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generatePlan } from '../services/tripService';
import { setCurrentTripId } from '../services/api';
import { formatCurrency, errorStyle, successStyle, loadingStyle } from '../utils/helpers';

function AIPlanner() {
  const [form, setForm] = useState({
    destination: '',
    days: '',
    budget: '',
    travel_type: 'solo',
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await generatePlan({
        destination: form.destination,
        days: Number(form.days),
        budget: Number(form.budget),
        travel_type: form.travel_type,
      });
      setPlan(data);
      if (data.trip_id) {
        setCurrentTripId(data.trip_id);
      }
      setSuccess('Trip plan generated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        AI Trip Planner
      </h1>

      {error && <div style={{ ...errorStyle, maxWidth: '400px', margin: '0 auto' }}>{error}</div>}
      {success && <div style={{ ...successStyle, maxWidth: '400px', margin: '0 auto' }}>{success}</div>}

      <div
        style={{
          width: '400px',
          margin: 'auto',
          border: '1px solid gray',
          padding: '20px'
        }}
      >
        <form onSubmit={handleGenerate}>
          <label>Destination</label>
          <br />
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
          <br /><br />

          <label>Number of Days</label>
          <br />
          <input
            type="number"
            name="days"
            value={form.days}
            onChange={handleChange}
            required
            min="1"
            style={{ width: '100%' }}
          />
          <br /><br />

          <label>Budget</label>
          <br />
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            required
            min="1"
            style={{ width: '100%' }}
          />
          <br /><br />

          <label>Travel Type</label>
          <br />
          <select
            name="travel_type"
            value={form.travel_type}
            onChange={handleChange}
            style={{ width: '100%' }}
          >
            <option value="solo">Solo</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
          </select>

          <br /><br />

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'purple',
              color: 'white',
              padding: '10px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Generating...' : 'Generate Plan'}
          </button>
        </form>
      </div>

      {loading && <p style={loadingStyle}>Generating your trip plan...</p>}

      {plan && (
        <div
          style={{
            width: '400px',
            margin: '20px auto',
            border: '1px solid gray',
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <h3>Generated Plan for {plan.destination?.name}</h3>
          <p>Days: {plan.days}</p>
          <p>Budget: {formatCurrency(plan.budget)}</p>
          <p>Travel Type: {plan.travel_type}</p>
          {plan.recommended_hotel && (
            <p>Hotel: {plan.recommended_hotel.name} ({formatCurrency(plan.recommended_hotel.price_per_night)}/night)</p>
          )}
          {plan.estimated_costs && (
            <p>Estimated Total: {formatCurrency(plan.estimated_costs.total)}</p>
          )}
          {plan.activities?.length > 0 && (
            <div>
              <strong>Activities:</strong>
              <ul>
                {plan.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Link to="/recommendations">
        <button style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          Next
        </button>
      </Link>
    </div>
  );
}

export default AIPlanner;
