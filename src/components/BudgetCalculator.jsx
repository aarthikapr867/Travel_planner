import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateBudget } from '../services/budgetService';
import { getCurrentTripId } from '../services/api';
import { formatCurrency, errorStyle, successStyle } from '../utils/helpers';

function BudgetCalculator() {
  const [form, setForm] = useState({
    travel_cost: '',
    hotel_cost: '',
    food_cost: '',
    activity_cost: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tripId = getCurrentTripId();
      const data = await calculateBudget({
        travel_cost: Number(form.travel_cost),
        hotel_cost: Number(form.hotel_cost),
        food_cost: Number(form.food_cost),
        activity_cost: Number(form.activity_cost),
        trip_id: tripId ? Number(tripId) : undefined,
      });
      setResult(data);
      setSuccess('Budget calculated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to calculate budget. Please login and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        Budget Calculator
      </h1>

      {error && <div style={{ ...errorStyle, maxWidth: '400px', margin: '0 auto' }}>{error}</div>}
      {success && <div style={{ ...successStyle, maxWidth: '400px', margin: '0 auto' }}>{success}</div>}

      <div
        style={{
          width: '400px',
          margin: 'auto',
          border: '1px solid gray',
          padding: '20px',
          borderRadius: '10px'
        }}
      >
        <form onSubmit={handleCalculate}>
          <label>Travel Cost</label>
          <br />
          <input
            type="number"
            name="travel_cost"
            value={form.travel_cost}
            onChange={handleChange}
            required
            min="0"
            style={{ width: '100%' }}
          />

          <br /><br />

          <label>Hotel Cost</label>
          <br />
          <input
            type="number"
            name="hotel_cost"
            value={form.hotel_cost}
            onChange={handleChange}
            required
            min="0"
            style={{ width: '100%' }}
          />

          <br /><br />

          <label>Food Cost</label>
          <br />
          <input
            type="number"
            name="food_cost"
            value={form.food_cost}
            onChange={handleChange}
            required
            min="0"
            style={{ width: '100%' }}
          />

          <br /><br />

          <label>Activity Cost</label>
          <br />
          <input
            type="number"
            name="activity_cost"
            value={form.activity_cost}
            onChange={handleChange}
            required
            min="0"
            style={{ width: '100%' }}
          />

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
            {loading ? 'Calculating...' : 'Calculate Budget'}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <h3>Total Budget: {formatCurrency(result.total)}</h3>
            <p>Travel: {formatCurrency(result.travel_cost)}</p>
            <p>Hotel: {formatCurrency(result.hotel_cost)}</p>
            <p>Food: {formatCurrency(result.food_cost)}</p>
            <p>Activity: {formatCurrency(result.activity_cost)}</p>
          </div>
        )}
      </div>
      <Link to="/checklist">
        <button style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          Next
        </button>
      </Link>
    </div>
  );
}

export default BudgetCalculator;
