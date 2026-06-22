import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJournals, createJournal } from '../services/journalService';
import { getCurrentTripId } from '../services/api';
import { errorStyle, successStyle, loadingStyle } from '../utils/helpers';

function TravelJournal() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchJournals = async () => {
      setFetching(true);
      try {
        const data = await getJournals();
        setJournals(data);
      } catch {
        // Journals may require auth; fail silently on load
      } finally {
        setFetching(false);
      }
    };

    fetchJournals();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const tripId = getCurrentTripId();

    try {
      const newJournal = await createJournal({
        title,
        notes,
        trip: tripId ? Number(tripId) : undefined,
        image,
      });
      setJournals((prev) => [newJournal, ...prev]);
      setTitle('');
      setNotes('');
      setImage(null);
      setSuccess('Journal saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save journal. Please login and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ textAlign: 'center', color: 'purple' }}>
        Travel Journal
      </h1>

      {error && <div style={{ ...errorStyle, maxWidth: '500px', margin: '0 auto' }}>{error}</div>}
      {success && <div style={{ ...successStyle, maxWidth: '500px', margin: '0 auto' }}>{success}</div>}

      <div
        style={{
          width: '500px',
          margin: 'auto',
          border: '1px solid gray',
          padding: '20px',
          borderRadius: '10px'
        }}
      >
        <form onSubmit={handleSave}>
          <label>Trip Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%' }}
          />

          <br /><br />

          <label>Travel Notes</label>
          <br />
          <textarea
            rows="5"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '100%' }}
          />

          <br /><br />

          <label>Upload Image</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0] || null)}
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
            {loading ? 'Saving...' : 'Save Journal'}
          </button>
        </form>
      </div>

      {fetching && <p style={loadingStyle}>Loading journals...</p>}

      {journals.length > 0 && (
        <div style={{ width: '500px', margin: '20px auto' }}>
          <h3>Your Journals</h3>
          {journals.map((journal) => (
            <div
              key={journal.id}
              style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}
            >
              <strong>{journal.title}</strong>
              <p>{journal.notes}</p>
            </div>
          ))}
        </div>
      )}

      <Link to="/summary">
        <button style={{ backgroundColor: 'purple', color: 'white', padding: '10px' }}>
          Next
        </button>
      </Link>
    </div>
  );
}

export default TravelJournal;
