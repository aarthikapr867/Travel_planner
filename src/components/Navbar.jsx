import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlane } from 'react-icons/fa';

function Navbar() {
  return (
    <nav
      style={{
        background: 'linear-gradient(135deg,#6A11CB,#2575FC)',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <h2 style={{ color: 'white' }}>
        <FaPlane /> TravelMate AI
      </h2>

      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </Link>

        <Link to="/discover" style={{ color: 'white', textDecoration: 'none' }}>
          Discover
        </Link>

        <Link to="/hotels" style={{ color: 'white', textDecoration: 'none' }}>
          Hotels
        </Link>

        <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;