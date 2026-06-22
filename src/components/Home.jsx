import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import hero from './assets/hero.jpg';
import { getFeaturedDestinations, searchDestinations } from '../services/destinationService';
import { formatCurrency, errorStyle, loadingStyle } from '../utils/helpers';

function Home() {
const [destinations, setDestinations] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

const fetchFeatured = async () => {
setLoading(true);
try {
const data = await getFeaturedDestinations();
setDestinations(data);
} catch (err) {
setError(err.message);
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchFeatured();
}, []);

const handleSearch = async () => {
if (!searchQuery.trim()) {
fetchFeatured();
return;
}

```
setLoading(true);

try {
  const data = await searchDestinations(searchQuery);
  setDestinations(data);
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

};

return ( <div>

```
  <nav
    style={{
      background: 'linear-gradient(135deg,#6A11CB,#2575FC)',
      padding: '15px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      position: 'fixed',
      width: '100%',
      zIndex: 1000
    }}
  >
    <h2>🌍 TravelMate AI</h2>

    <div style={{ display: 'flex', gap: '20px' }}>
      <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/discover" style={{ color: 'white', textDecoration: 'none' }}>Discover</Link>
      <Link to="/hotels" style={{ color: 'white', textDecoration: 'none' }}>Hotels</Link>
      <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
    </div>
  </nav>

  <div
    style={{
      backgroundImage: `url(${hero})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      position: 'relative'
    }}
  >
    <div
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '80px',
        color: 'white'
      }}
    >
      <motion.h1
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ fontSize: '70px' }}
      >
        Explore The World
      </motion.h1>

      <p style={{ fontSize: '24px' }}>
        AI Powered Smart Travel Planning
      </p>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '10px'
        }}
      >
        <input
          type="text"
          placeholder="Search destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '350px',
            padding: '15px',
            borderRadius: '30px',
            border: 'none'
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            background: '#6A11CB',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '15px 25px',
            cursor: 'pointer'
          }}
        >
          <FaSearch />
        </button>
      </div>

      <Link to="/discover">
        <button
          style={{
            marginTop: '20px',
            padding: '12px 30px',
            background: '#2575FC',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer'
          }}
        >
          Explore Now
        </button>
      </Link>
    </div>
  </div>

  <div style={{ padding: '50px' }}>
    <h1
      style={{
        textAlign: 'center',
        color: '#6A11CB'
      }}
    >
      Featured Destinations
    </h1>

    {loading && (
      <p style={loadingStyle}>Loading destinations...</p>
    )}

    {error && (
      <div style={errorStyle}>{error}</div>
    )}

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
        gap: '25px',
        marginTop: '40px'
      }}
    >
      {destinations.map((dest) => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          key={dest.id}
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}
        >
          <h2>
            <FaMapMarkerAlt color="#6A11CB" /> {dest.name}
          </h2>

          <p>{dest.description}</p>

          <p>
            {dest.duration_days} Days • {formatCurrency(dest.budget)}
          </p>

          <p>
            <FaStar color="gold" /> {dest.rating}
          </p>

          <p>
            Weather: {dest.weather?.temperature}°C
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</div>


);
}

export default Home;
