import React, { useState } from 'react';
import image from './image.png';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { errorStyle, successStyle } from '../utils/helpers';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await login({ username, password });
      setSuccess('Login successful!');
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <img src={image} alt="" style={{ width: '100%', height: '700px' }} />

      <div style={{ position: 'absolute', top: '30%', left: '40%' }}>
        <div
          style={{
            width: '300px',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            borderRadius: '5px'
          }}
        >
          <h2
            style={{
              backgroundColor: 'purple',
              color: 'white',
              textAlign: 'center',
              padding: '10px'
            }}
          >
            Login
          </h2>

          {error && <div style={errorStyle}>{error}</div>}
          {success && <div style={successStyle}>{success}</div>}

          <form onSubmit={handleLogin}>
            <label>Username:</label>
            <br />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '90%', marginBottom: '10px' }}
            />

            <br />

            <label>Password:</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '90%', marginBottom: '10px' }}
            />

            <br />

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'purple',
                color: 'white',
                padding: '5px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p>
            New User? <Link to="/register">Register Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
