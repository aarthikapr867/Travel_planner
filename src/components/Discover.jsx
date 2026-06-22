import React, { useEffect, useState } from 'react';
import beach from './beach.jpg';
import mountain from './mountain.jpg';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/destinationService';
import { errorStyle, loadingStyle } from '../utils/helpers';

const categoryMeta = {
  beach: { icon: '🏖', image: beach },
  mountain: { icon: '⛰', image: mountain },
  historical: { icon: '🏰', image: null },
};

function Discover() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message || 'Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        Discover Destinations
      </h1>

      {loading && <p style={loadingStyle}>Loading categories...</p>}
      {error && <div style={{ ...errorStyle, maxWidth: '500px', margin: '0 auto' }}>{error}</div>}

      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        {categories.map((cat) => {
          const meta = categoryMeta[cat.category] || { icon: '📍', image: null };
          const places = cat.destinations.map((d) => d.name).join(', ');

          return (
            <div
              key={cat.category}
              style={{
                border: '1px solid gray',
                padding: '20px',
                width: '250px',
                borderRadius: '10px'
              }}
            >
              {meta.image && (
                <img
                  src={meta.image}
                  alt={cat.label}
                  style={{
                    width: '100%',
                    height: '150px',
                    borderRadius: '10px'
                  }}
                />
              )}
              <h3>{meta.icon} {cat.label}</h3>
              <p>{places}</p>
            </div>
          );
        })}
      </div>
      <Link to="/aiplanner">
        <button style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          Next
        </button>
      </Link>
    </div>
  );
}

export default Discover;
