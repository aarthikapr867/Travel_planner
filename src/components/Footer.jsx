import React from 'react';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer
      style={{
        background: '#111827',
        color: 'white',
        textAlign: 'center',
        padding: '30px',
        marginTop: '50px'
      }}
    >
      <h3>TravelMate AI</h3>

      <p>Plan smarter. Travel better.</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '25px',
          marginTop: '10px'
        }}
      >
        <FaInstagram />
        <FaGithub />
        <FaLinkedin />
      </div>

      <p style={{ marginTop: '15px' }}>
        © 2026 TravelMate AI
      </p>
    </footer>
  );
}

export default Footer;