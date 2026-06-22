import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout } from '../services/authService';
import { clearCurrentTripId } from '../services/api';
import { errorStyle, loadingStyle } from '../utils/helpers';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile. Please login.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      clearCurrentTripId();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Logout failed.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        User Profile
      </h1>

      {loading && <p style={loadingStyle}>Loading profile...</p>}
      {error && <div style={{ ...errorStyle, maxWidth: '400px', margin: '0 auto' }}>{error}</div>}

      {profile && (
        <div
          style={{
            width: '400px',
            margin: 'auto',
            border: '1px solid gray',
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <h3>Name : {profile.username}</h3>
          <h3>Email : {profile.email}</h3>
          <h3>Trips Planned : {profile.trips_planned}</h3>

          <h3>Favourite Destinations</h3>
          {profile.favourite_destinations?.length > 0 ? (
            profile.favourite_destinations.map((dest) => (
              <p key={dest}>{dest}</p>
            ))
          ) : (
            <p>No favourite destinations yet.</p>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              backgroundColor: 'purple',
              color: 'white',
              padding: '10px',
              cursor: loggingOut ? 'not-allowed' : 'pointer'
            }}
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}
      >
        {loggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default Profile;
