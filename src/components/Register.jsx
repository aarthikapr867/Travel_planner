import React, { useState } from 'react';
import image from './image.png';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { errorStyle, successStyle } from '../utils/helpers';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    dob: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(form);
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <img src={image} alt="" style={{ width: '100%', height: '700px' }} />

      <div style={{ position: 'absolute', top: '15%', left: '40%' }}>
        <div
          style={{
            width: '500px',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            borderRadius: '10px'
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
            Event Registration
          </h2>

          {error && <div style={errorStyle}>{error}</div>}
          {success && <div style={successStyle}>{success}</div>}

          <form onSubmit={handleRegister}>
            <label>Username:</label>
            <br />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ width: '120px' }}
            />

            <br /><br />

            <label>DOB:</label>
            <br />
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              style={{ width: '120px' }}
            />

            <br /><br />

            <label>Email:</label>
            <br />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '120px' }}
            />

            <br /><br />

            <label>Mobile No:</label>
            <br />
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              style={{ width: '120px' }}
            />

            <br /><br />

            <label>Password:</label>
            <br />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '120px' }}
            />

            <br /><br />

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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
