import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChecklist, updateChecklistItem } from '../services/checklistService';
import { getCurrentTripId } from '../services/api';
import { errorStyle, loadingStyle } from '../utils/helpers';

function Checklist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChecklist = async () => {
      setLoading(true);
      setError('');

      const tripId = getCurrentTripId();
      if (!tripId) {
        setError('No active trip found. Generate a plan first.');
        setLoading(false);
        return;
      }

      try {
        const data = await getChecklist(tripId);
        setItems(data);
      } catch (err) {
        setError(err.message || 'Failed to load checklist. Please login and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, []);

  const handleToggle = async (item) => {
    setUpdatingId(item.id);
    setError('');

    try {
      const updated = await updateChecklistItem(item.id, { is_checked: !item.is_checked });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch (err) {
      setError(err.message || 'Failed to update item.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        Packing Checklist
      </h1>

      {loading && <p style={loadingStyle}>Loading checklist...</p>}
      {error && <div style={{ ...errorStyle, maxWidth: '350px', margin: '0 auto' }}>{error}</div>}

      <div
        style={{
          width: '350px',
          margin: 'auto',
          border: '1px solid gray',
          padding: '20px',
          borderRadius: '10px'
        }}
      >
        {items.map((item) => (
          <p key={item.id}>
            <input
              type="checkbox"
              checked={item.is_checked}
              disabled={updatingId === item.id}
              onChange={() => handleToggle(item)}
            />
            {item.item_name}
          </p>
        ))}
        {!loading && items.length === 0 && !error && (
          <p>No checklist items found.</p>
        )}
      </div>
      <Link to="/weather">
        <button style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          Next
        </button>
      </Link>
    </div>
  );
}

export default Checklist;
