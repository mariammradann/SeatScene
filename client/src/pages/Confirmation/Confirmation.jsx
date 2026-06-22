import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, FaChair, FaMapMarkerAlt, 
  FaCheckCircle, FaChevronRight 
} from 'react-icons/fa';
import './Confirmation.css';

const Confirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Destructure state passed from the previous step (e.g., Payment component)
    const { show, theater, time, selectedSeats, totalPrice, paymentMethod } = location.state || {};

    useEffect(() => {
        // Guard clause: Redirect if critical data is missing (simulating a failed or incomplete navigation)
        if (!show || !selectedSeats || !totalPrice || !paymentMethod) {
            console.error("Missing booking confirmation data. Redirecting.");
            navigate('/theater-shows');
        } else {
            try {
                // Save confirmed booking to localStorage so it populates the Profile Page
                const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
                
                // Formulate a clean movie/show title
                const showTitle = show.title || (typeof show === 'string' ? show : 'Movie Show');
                
                const newBooking = {
                    id: 'B' + Math.floor(10000 + Math.random() * 90000),
                    showTitle: showTitle,
                    theater: theater || 'Main Cinema / Theater',
                    time: time || 'N/A',
                    seats: selectedSeats,
                    price: totalPrice,
                    date: new Date().toLocaleDateString(),
                };

                // Check for duplicates to prevent duplicate saves on re-render
                const isDuplicate = existingBookings.some(
                    b => b.showTitle === newBooking.showTitle && 
                    b.time === newBooking.time && 
                    JSON.stringify(b.seats) === JSON.stringify(newBooking.seats)
                );

                if (!isDuplicate) {
                    existingBookings.push(newBooking);
                    localStorage.setItem('user_bookings', JSON.stringify(existingBookings));
                }
            } catch (err) {
                console.error("Failed to store booking data in localStorage", err);
            }
        }
    }, [show, selectedSeats, totalPrice, paymentMethod, navigate, theater, time]);

    const handleBackToShows = () => {
        navigate('/venue-selection');
    };

    if (!show || !selectedSeats || !totalPrice || !paymentMethod) {
        return null;
    }

    const showTitle = show.title || (typeof show === 'string' ? show : 'Movie Show');
    const ticketId = 'B' + Math.floor(10000 + Math.random() * 90000);

    return (
        <div className="confirmation-wrapper">
            <div className="success-banner">
                <FaCheckCircle className="success-check-icon" />
                <h1 className="confirmation-title">Booking Confirmed!</h1>
                <p className="confirmation-subtitle">Your tickets are ready. Show this boarding pass at the counter.</p>
            </div>

            {/* Premium Cinema Ticket Card */}
            <div className="ticket-card-confirmed">
                {/* Left and right notches for authentic ticket look */}
                <div className="ticket-notch left"></div>
                <div className="ticket-notch right"></div>
                
                <div className="ticket-inner">
                    <div className="ticket-main">
                        <div className="ticket-header">
                            <span className="ticket-tag">BOARDING PASS</span>
                            <span className="ticket-id">ID: {ticketId}</span>
                        </div>
                        
                        <h2 className="ticket-title">{showTitle}</h2>
                        
                        <div className="ticket-details-grid">
                            <div className="ticket-item">
                                <FaMapMarkerAlt className="ticket-icon" />
                                <div>
                                    <span className="item-lbl">VENUE</span>
                                    <span className="item-val">{theater || 'Main Cinema'}</span>
                                </div>
                            </div>

                            <div className="ticket-item">
                                <FaCalendarAlt className="ticket-icon" />
                                <div>
                                    <span className="item-lbl">DATE & TIME</span>
                                    <span className="item-val">{new Date().toLocaleDateString()} at {time || '7:00 PM'}</span>
                                </div>
                            </div>

                            <div className="ticket-item">
                                <FaChair className="ticket-icon" />
                                <div>
                                    <span className="item-lbl">SEATS</span>
                                    <span className="item-val seats-color">{selectedSeats.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ticket-aside">
                        <div className="price-container">
                            <span className="price-lbl">TOTAL PAID</span>
                            <span className="price-val">{totalPrice} EGP</span>
                        </div>
                        <div className="barcode-simulation">
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar font-thin"></div>
                            <div className="bar font-thick"></div>
                            <div className="bar"></div>
                            <div className="bar font-thin"></div>
                            <div className="bar font-thick"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="actions-container">
                <button className="confirm-btn-premium" onClick={handleBackToShows}>
                    Done <FaChevronRight className="btn-chevron" />
                </button>
            </div>
        </div>
    );
};

export default Confirmation;
