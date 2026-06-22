import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
// NOTE: We assume you have index.css in your project root
// import '../../index.css'; 
import './CinemaMovies.css'; 

const mockMovieData = [
  { _id: '1', title: 'Al-Hana Elli Ana Fih', formattedDuration: '120 min', genre: 'Drama', screenType: 'IMAX', showtimes: ['2:00 PM', '5:00 PM', '8:00 PM'] },
  { _id: '2', title: 'Siko Siko', formattedDuration: '95 min', genre: 'Comedy', screenType: 'Standard', showtimes: ['1:30 PM', '4:30 PM', '7:30 PM'] },
  { _id: '3', title: 'Flight 404', formattedDuration: '135 min', genre: 'Action', screenType: '3D', showtimes: ['11:00 AM', '6:00 PM', '9:00 PM'] },
  { _id: '4', title: 'Until Dawn', formattedDuration: '105 min', genre: 'Horror', screenType: 'Standard', showtimes: ['10:00 PM', '11:59 PM'] },
  { _id: '5', title: 'Thunderbolts', formattedDuration: '145 min', genre: 'Superhero', screenType: 'IMAX', showtimes: ['3:30 PM', '7:00 PM'] },
  { _id: '6', title: 'The Accountant 2', formattedDuration: '130 min', genre: 'Thriller', screenType: 'Standard', showtimes: ['2:30 PM', '5:30 PM', '8:30 PM'] },
];

// Using placeholder images as per the instruction "despite the photos"
const POSTERS = {
  'Al-Hana Elli Ana Fih': 'https://placehold.co/260x380/007bff/ffffff?text=Al+Hana',
  'Siko Siko': 'https://placehold.co/260x380/28a745/ffffff?text=Siko+Siko',
  'Flight 404': 'https://placehold.co/260x380/dc3545/ffffff?text=Flight+404',
  'Until Dawn': 'https://placehold.co/260x380/6f42c1/ffffff?text=Until+Dawn',
  'Thunderbolts': 'https://placehold.co/260x380/ffc107/000000?text=Thunderbolts',
  'The Accountant 2': 'https://placehold.co/260x380/17a2b8/ffffff?text=Accountant+2',
};
const DEFAULT_POSTER = 'https://placehold.co/260x380/6c757d/ffffff?text=No+Image';

export default function CinemaMovies() {
  const [movies, setMovies] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const trackRef = useRef(null);
  const cardRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  // Retrieves the location passed from the previous page (VenueSelection), defaults to placeholder
  const selectedLocation = location.state?.location || 'Select Location'; 

  useEffect(() => {
    // Process mock data to include posters and ensure showtimes are arrays
    const processed = mockMovieData.map(m => ({
      ...m,
      poster: POSTERS[m.title] || DEFAULT_POSTER,
      duration: m.formattedDuration || 'N/A',
      showtimes: Array.isArray(m.showtimes) ? m.showtimes : []
    }));
    setMovies(processed);
  }, []);

  /**
   * Scrolls the carousel track by one card width (plus gap).
   * @param {'next' | 'prev'} dir - Direction to scroll.
   */
  const scrollBy = (dir = 'next') => {
    const el = trackRef.current;
    if (!el) return;
    // Find the width of a card and the gap between cards dynamically
    const card = el.querySelector('.poster-card');
    const cardWidth = card ? card.offsetWidth : 240;
    // Get gap value from CSS
    const gapStyle = getComputedStyle(el).gap;
    const gap = gapStyle ? parseInt(gapStyle, 10) : 64; 
    
    const delta = (cardWidth + gap) * (dir === 'next' ? 1 : -1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  /**
   * Scrolls the track to center the currently selected movie card.
   * @param {string} movieId - The ID of the movie card to center.
   */
  const centerCard = (movieId) => {
    const track = trackRef.current;
    const card = cardRefs.current[movieId];
    if (!track || !card) return;
    
    // Calculate the scroll position needed to center the card
    const leftInTrack = card.offsetLeft;
    const targetScroll = leftInTrack - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  /**
   * Handles click on a showtime button, updating selection and centering the card.
   */
  const handleTimeClick = (movieId, time) => {
    // Update selection state
    setSelectedMovieId(movieId);
    setSelectedTime(time);
    
    // Center the card after the selection state has had a chance to render (small timeout)
    setTimeout(() => centerCard(movieId), 80);
  };

  /**
   * Handles the "Buy ticket" button click, navigating to the seating selection page.
   */
  const handleBuy = () => {
    if (!selectedMovieId || !selectedTime) return;
    
    const movie = movies.find(m => m._id === selectedMovieId);
    
    // Navigate to the next page, passing the required data in state
    navigate('/CinemaSeating', { 
        state: { 
            movie, 
            selectedTime, 
            location: selectedLocation 
        } 
    });
  };

  return (
    <div className="cinema-page">
      {/* Black bars to match the visual design. These sit above the page content but below NavHeader. */}
      <div className="app-topbar" />
      <div className="app-bottombar" />

      {/* Title and Location */}
      <h1 className="cinema-title">Cinema</h1>
      <div className="cinema-location">Location: <strong>{selectedLocation}</strong></div>

      {/* Carousel Container */}
      <div className="carousel-outer" aria-label="Movie Listings Carousel">
        <button 
            className="carousel-arrow left" 
            onClick={() => scrollBy('prev')} 
            aria-label="Previous movie"
        >
          <FaChevronLeft />
        </button>

        <div className="carousel-track" ref={trackRef}>
          {movies.map(movie => (
            <div
              className={`poster-card ${selectedMovieId === movie._id ? 'selected' : ''}`}
              key={movie._id}
              ref={el => { cardRefs.current[movie._id] = el; }}
            >
              {/* Movie Poster Image */}
              <img
                src={movie.poster}
                alt={movie.title}
                className="poster-img"
                onError={e => e.currentTarget.src = DEFAULT_POSTER}
                // Reduced the bottom margin of the poster image from 12px to 6px
                style={{ marginBottom: 6 }}
              />
              
              {/* Movie Metadata */}
              <div className="poster-meta">
                {/* Reduced the bottom margin of the movie title from 6px to 4px */}
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{movie.title}</div>
                <div style={{ fontSize: 13, color: '#cfcfcf' }}>{movie.genre} • {movie.duration}</div>
              </div>

              {/* Showtimes Buttons */}
              {/* Reduced gap between buttons and applied a small top margin to pull closer to meta */}
              <div style={{ display: 'flex', gap: 4, justifyContent: 'center', margin: '4px 0 8px', flexWrap: 'wrap' }}>
                {movie.showtimes.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleTimeClick(movie._id, t)}
                    // Conditional styling for selected showtime
                    style={{
                      padding: '6px 8px', // Reduced horizontal padding for smaller buttons
                      borderRadius: 8,
                      background: selectedMovieId === movie._id && selectedTime === t ? 'var(--btn-cyan)' : '#000',
                      color: selectedMovieId === movie._id && selectedTime === t ? 'var(--btn-cyan-text)' : '#fff',
                      border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      fontSize: 13,
                      minWidth: 60 // Reduced minimum width for compactness
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Buy Ticket Button */}
              <button
                className="buy-ticket"
                onClick={handleBuy}
                // Button is only enabled if the movie is selected AND a time is selected
                disabled={!(selectedMovieId === movie._id && selectedTime)} 
              >
                Buy ticket
              </button>
            </div>
          ))}
          {/* Spacer div to allow the last element to be centered */}
          <div style={{ width: 24, flexShrink: 0 }} aria-hidden="true" />
        </div>

        <button 
            className="carousel-arrow right" 
            onClick={() => scrollBy('next')} 
            aria-label="Next movie"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}