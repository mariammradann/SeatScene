import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, FaEnvelope, FaUser, FaUserShield, 
  FaTicketAlt, FaSignOutAlt, FaCalendarAlt, FaChair, 
  FaMapMarkerAlt, FaHeart 
} from 'react-icons/fa';
import './UserProfile.css';

// Default mock user data if none exists in localStorage
const DEFAULT_USER_DATA = {
  name: 'Demo User',
  email: 'demo@seatscene.com',
  username: 'demouser',
  role: 'user',
  favoriteGenres: ['Action', 'Comedy', 'Sci-Fi'],
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data from local storage or backend
    setLoading(true);
    setTimeout(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedBookings = JSON.parse(localStorage.getItem('user_bookings'));
      
      const activeUser = storedUser || DEFAULT_USER_DATA;
      
      // Fallback bookings to make the profile look rich if they haven't booked anything yet
      const activeBookings = storedBookings && storedBookings.length > 0 
        ? storedBookings 
        : [
            {
              id: 'B8274',
              showTitle: 'Thunderbolts',
              theater: 'Mall of Egypt (IMAX)',
              time: '7:00 PM',
              seats: ['A5', 'A6'],
              price: 250, // 2 seats @ 125 EGP each
              date: new Date().toLocaleDateString(),
            },
            {
              id: 'B1092',
              showTitle: 'Omar Khairat Concert',
              theater: 'Cairo Opera House',
              time: '9:00 PM',
              seats: ['C12'],
              price: 125, // 1 seat @ 125 EGP
              date: '06/25/2026',
            }
          ];

      setUser({
        ...activeUser,
        totalBookings: activeBookings.length,
        activeBookings: activeBookings.length, // Assume all are active for mockup
        favoriteGenres: activeUser.favoriteGenres || ['Action', 'Comedy', 'Sci-Fi']
      });
      setBookings(activeBookings);
      setLoading(false);
    }, 400);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleGenreToggle = (genre) => {
    setUser(prev => {
      const genres = prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre];
      return { ...prev, favoriteGenres: genres };
    });
  };

  if (loading) {
    return (
      <div className="user-profile-wrapper">
        <div className="profile-loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-wrapper">
      <div className="profile-container">
        
        {/* Left Column: User Card */}
        <div className="profile-left-col">
          <div className="user-card-premium">
            <div className="avatar-wrapper">
              <FaUserCircle className="avatar-icon-premium" />
              <span className="user-role-badge">{user.role}</span>
            </div>
            
            <h2 className="user-display-name">{user.name}</h2>
            <p className="user-display-email">
              <FaEnvelope className="label-icon" /> {user.email}
            </p>
            
            <div className="user-username-row">
              <span className="username-pill">@{user.username || 'user'}</span>
            </div>

            <hr className="divider-line" />

            <div className="user-stats-container">
              <div className="stat-card">
                <span className="stat-num">{user.totalBookings}</span>
                <span className="stat-desc">Total Bookings</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">{user.activeBookings}</span>
                <span className="stat-desc">Active Tickets</span>
              </div>
            </div>

            <button onClick={handleLogout} className="logout-btn-premium">
              <FaSignOutAlt className="btn-icon" /> Log Out
            </button>
          </div>

          {/* Favorite Genres Card */}
          <div className="genres-card-premium">
            <h3>
              <FaHeart className="title-icon-heart" /> Favorite Genres
            </h3>
            <div className="genres-grid">
              {['Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi', 'Horror', 'Concerts'].map((genre) => {
                const isFav = user.favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`genre-pill-interactive ${isFav ? 'active' : ''}`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Bookings & Tickets */}
        <div className="profile-right-col">
          <div className="bookings-header-row">
            <h2>My Tickets & Bookings</h2>
            <span className="ticket-count-badge">{bookings.length}</span>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-bookings-card">
              <FaTicketAlt className="empty-ticket-icon" />
              <p className="empty-title">No Bookings Found</p>
              <p className="empty-subtitle">You haven't booked any show or cinema tickets yet.</p>
              <button onClick={() => navigate('/venue-selection')} className="book-now-btn">
                Browse Shows
              </button>
            </div>
          ) : (
            <div className="tickets-list-premium">
              {bookings.map((booking) => (
                <div key={booking.id} className="ticket-card-premium">
                  {/* Left and right notches for authentic ticket look */}
                  <div className="ticket-edge-notch left"></div>
                  <div className="ticket-edge-notch right"></div>
                  
                  <div className="ticket-body">
                    <div className="ticket-main-info">
                      <span className="ticket-id-tag">TICKET ID: {booking.id}</span>
                      <h4 className="ticket-show-title">{booking.showTitle}</h4>
                      
                      <div className="ticket-details-grid">
                        <div className="ticket-detail">
                          <FaMapMarkerAlt className="ticket-icon" />
                          <div>
                            <span className="detail-lbl">VENUE</span>
                            <span className="detail-val">{booking.theater}</span>
                          </div>
                        </div>

                        <div className="ticket-detail">
                          <FaCalendarAlt className="ticket-icon" />
                          <div>
                            <span className="detail-lbl">DATE & TIME</span>
                            <span className="detail-val">{booking.date} at {booking.time}</span>
                          </div>
                        </div>

                        <div className="ticket-detail">
                          <FaChair className="ticket-icon" />
                          <div>
                            <span className="detail-lbl">SEATS</span>
                            <span className="detail-val seats-val">
                              {Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-sidebar">
                      <div className="ticket-price-section">
                        <span className="price-lbl">TOTAL PRICE</span>
                        <span className="price-val">{booking.price} EGP</span>
                      </div>
                      <div className="ticket-status-pill">
                        Confirmed
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;