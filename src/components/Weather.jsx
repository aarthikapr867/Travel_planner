import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWeather } from '../services/weatherService';
import { errorStyle, loadingStyle } from '../utils/helpers';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getWeather('Kodaikanal');
        setWeatherData(data);
      } catch (err) {
        setError(err.message || 'Failed to load weather data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        Weather Forecast
      </h1>

      {loading && <p style={loadingStyle}>Loading weather...</p>}
      {error && <div style={{ ...errorStyle, maxWidth: '350px', margin: '0 auto' }}>{error}</div>}

      {weatherData && (
        <div
          style={{
            width: '350px',
            margin: 'auto',
            border: '1px solid gray',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}
        >
          <h2>{weatherData.destination}</h2>

          <h1>{weatherData.weather.temperature}°C</h1>

          <p>☁ {weatherData.weather.condition}</p>

          <p>Humidity : {weatherData.weather.humidity}%</p>

          <p>Wind Speed : {weatherData.weather.wind_speed} km/h</p>
        </div>
      )}

      <Link to="/traveljournal">
        <button style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          Next
        </button>
      </Link>
    </div>
  );
}

export default Weather;
