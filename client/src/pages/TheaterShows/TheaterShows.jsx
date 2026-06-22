import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TheaterShows.css';

const mockShows = [
  {
    id: '1',
    title: 'Omar Khairat Live Concert',
    description: 'An unforgettable evening with the legendary composer performing his iconic pieces.',
    imageUrl: 'https://via.placeholder.com/800x450?text=Omar+Khairat+Concert',
    locations: [
      { name: 'Cairo Opera House', timings: ['19:00', '21:00'] },
      { name: 'Alexandria Opera House', timings: ['20:00'] },
    ],
  },
  {
    id: '2',
    title: 'The Lion King Musical',
    description: "A spectacular family show with stunning visuals and music.",
    imageUrl: 'https://via.placeholder.com/800x450?text=Lion+King+Musical',
    locations: [
      { name: 'Grand Theater Cairo', timings: ['18:00', '21:30'] },
    ],
  },
  {
    id: '3',
    title: 'Stand-up Comedy Night',
    description: "Top comedians delivering a night of nonstop laughs.",
    imageUrl: 'https://via.placeholder.com/800x450?text=Comedy+Night',
    locations: [
      { name: 'Comedy Club Downtown', timings: ['20:00', '22:00'] },
    ],
  },
];

export default function TheaterShows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      try {
        setShows(mockShows);
        setError(null);
      } catch (e) {
        setError('Failed to load shows.');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://via.placeholder.com/800x450?text=No+Image';
  };

  // navigate to the seating page at path "/seating"
  const handleSelectShow = (show, selectedTime, locationName) => {
    navigate('/seating', {
      state: {
        show,
        selectedTime,
        location: locationName,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-indigo-600 text-lg">Loading shows...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="theater-shows-page">
      <div className="theater-content-wrapper">
        <h1 className="theater-main-title">Available Shows</h1>

        <div className="theater-grid">
          {shows.map((show) => (
            <div key={show.id} className="theater-card">
              <div style={{ position: 'relative', height: '176px' }}>
                <img
                  src={show.imageUrl}
                  alt={show.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={handleImageError}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', padding: '16px', display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                  <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 600, margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>{show.title}</h2>
                </div>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <p className="description-text" style={{ fontSize: '0.875rem', marginBottom: '20px', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{show.description}</p>

                {show.locations.map((loc, idx) => (
                  <div key={idx} className="location-block" style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div className="location-name">
                      <span style={{ marginRight: '8px', color: '#ab47bc' }}>📍</span>
                      {loc.name}
                    </div>

                    <div className="timings-container">
                      {loc.timings.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleSelectShow(show, time, loc.name)}
                          className="timing-btn"
                          aria-label={`Select ${show.title} at ${loc.name} ${time}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}