import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CardDetails.css';
// import logoImg from '../../assets/SeatScene logo.png'; // Assuming logoImg is available

// Mock logo path for demonstration
const logoImg = 'https://via.placeholder.com/150x50?text=SeatScene+Logo'; 

// ==========================================================
// CONSTANTS
// ==========================================================

// Define the minimum required total price (125 EGP)
const MIN_TOTAL_PRICE = 125; 

// ==========================================================
// MOCK API (Simulates Payment Processing)
// ==========================================================

/**
 * Simulates a secure payment transaction.
 * @param {object} bookingDetails - The final transaction details.
 */
const mockPaymentApi = (bookingDetails) => {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            const { totalPrice, paymentMethod } = bookingDetails;
            
            // --- MOCK FAILURE CONDITIONS (for testing error state) ---
            // Simulate payment failure for large amounts or specific methods
            if (totalPrice > 500) {
                 reject({ status: 400, message: 'Payment gateway rejected transaction (amount too high for mock).' });
                 return;
            }
            if (paymentMethod === 'mastercard') {
                // Simulate a random failure for a specific method
                 if (Math.random() < 0.4) {
                    reject({ status: 503, message: 'Mastercard service temporarily unavailable. Try Visa.' });
                    return;
                }
            }

            // --- MOCK SUCCESS ---
            resolve({ 
                status: 200, 
                message: 'Payment confirmed. Booking successful!',
                transactionId: `TX${Date.now()}`
            });

        }, 1500); // 1.5 second delay
    });
};

// ==========================================================
// REACT COMPONENT
// ==========================================================

const CardDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Dummy data fallback for direct access/testing
    const {
        show,
        theater,
        time,
        selectedSeats,
        totalPrice,
        paymentMethod
    } = location.state || {
        show: { title: 'Test Show' },
        theater: 'Test Theater',
        time: '7:00 PM',
        selectedSeats: ['A1', 'A2'],
        // Fixed fallback totalPrice
        totalPrice: 150, 
        paymentMethod: 'visa' // Default to visa for card form
    };

    // Form state
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Check if it's a card payment method
    const isCardPayment = ['visa', 'mastercard', 'paypal'].includes(paymentMethod);

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.join(' ').substring(0, 19); // Max length 19 (16 digits + 3 spaces)
    };

    // Format expiry date
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 3) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        } else if (v.length >= 1) {
             return v.substring(0, 2);
        }
        return v;
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (isCardPayment) {
            if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 16) {
                newErrors.cardNumber = 'Enter a valid 16-digit card number';
            }
            if (!cardName || cardName.trim().length < 3) {
                newErrors.cardName = 'Enter the name on card';
            }
            // Basic expiry date validation (MM/YY format)
            if (!expiryDate || expiryDate.length < 5 || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
                newErrors.expiryDate = 'Format: MM/YY';
            }
            if (!cvv || cvv.length < 3) {
                newErrors.cvv = 'Enter a 3 or 4 digit CVV';
            }
        } else {
            // Account payment (e.g., Vodafone Cash)
            if (!phoneNumber || phoneNumber.length < 10) {
                newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
            }
            if (!password || password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- Minimum Price Check (Total >= 125 EGP) ---
        if (totalPrice < MIN_TOTAL_PRICE) {
            toast.error(`The minimum booking amount is ${MIN_TOTAL_PRICE} EGP. Please adjust your booking.`);
            return;
        }
        // ----------------------------------------------------
        
        // 1. Run Validation
        if (!validateForm()) {
            toast.error('Please correct the errors in the form.');
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Processing payment...');

        try {
            // 2. Mock API Call
            const bookingDetails = {
                show: show, 
                theater: theater, 
                time: time, 
                selectedSeats: selectedSeats, 
                totalPrice: totalPrice, 
                paymentMethod: paymentMethod,
                transactionData: isCardPayment ? { cardNumber, expiryDate } : { phoneNumber } 
            };
            
            await mockPaymentApi(bookingDetails);

            // 3. Success Feedback and Navigation
            toast.dismiss(loadingToast);
            toast.success('Payment Successful! Redirecting...');

            // Wait a moment for the toast, then navigate
            setTimeout(() => {
                navigate('/confirmation', {
                    state: {
                        show: show,
                        theater: theater,
                        time: time,
                        selectedSeats: selectedSeats,
                        totalPrice: totalPrice,
                        paymentMethod: isCardPayment ? 'Credit/Debit Card' : 'Mobile Account' // Reflect actual payment type
                    }
                });
            }, 1000);

        } catch (error) {
            // 4. Error Feedback
            toast.dismiss(loadingToast);
            toast.error(error.message || 'Payment failed. Please check details and try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // NOTE: handleBack() function removed as navigation is now handled by NavHeader

    // Handle cancel button
    const handleCancel = () => {
        // Clear local state or redirect to main movie list
        navigate('/theater-shows');
    };

    // Prevent rendering if essential data is missing
    if (!show || !selectedSeats || !paymentMethod) {
        // Display an error or redirect if state is missing unexpectedly
        useEffect(() => {
            toast.error('Missing booking details. Redirecting to start over.');
            setTimeout(() => navigate('/theater-shows'), 2000);
        }, [navigate]);
        return <div className="loading-message">Loading or redirecting...</div>;
    }

    return (
        <div className="card-details-container">
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* NOTE: Logo section moved to NavHeader component, keeping here for fallback if NavHeader isn't used */}
            <div className="logo-section">
                <img
                    src={logoImg}
                    alt="Seat Scene Logo"
                    className="logo-img"
                    onClick={() => navigate('/theater-shows')}
                    style={{ cursor: 'pointer' }}
                />
            </div>

            <div className="card-details-card">
                <h1>{isCardPayment ? 'Enter Card Details' : `Enter ${paymentMethod.toUpperCase()} Details`}</h1>

                <form onSubmit={handleSubmit} className="payment-form">
                    {isCardPayment ? (
                        <>
                            <div className="form-group">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    required
                                />
                                {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
                            </div>
                            {/* ... (rest of card inputs) */}
                            <div className="form-group">
                                <label htmlFor="cardName">Name on Card</label>
                                <input
                                    type="text"
                                    id="cardName"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                                {errors.cardName && <span className="error">{errors.cardName}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label htmlFor="expiryDate">Expiry Date</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        required
                                    />
                                    {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
                                </div>

                                <div className="form-group half">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        type="password"
                                        id="cvv"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="123"
                                        maxLength="4"
                                        required
                                    />
                                    {errors.cvv && <span className="error">{errors.cvv}</span>}
                                </div>
                            </div>
                        </>
                    ) : (
                        // Mobile/Account Payment Fields
                        <>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number for {paymentMethod.toUpperCase()}</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="Enter your phone number"
                                    required
                                />
                                {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">PIN/Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your service PIN/password"
                                    required
                                />
                                {errors.password && <span className="error">{errors.password}</span>}
                            </div>
                        </>
                    )}

                    <div className="booking-summary">
                        <h3>Booking Summary</h3>
                        {/* Accessing show title safely */}
                        <p className="summary-item">Movie: <span className="highlight">{show?.title || show}</span></p> 
                        <p className="summary-item">Theater: <span className="highlight">{theater}</span></p>
                        <p className="summary-item">Time: <span className="highlight">{time}</span></p>
                        <p className="summary-item">Seats: <span className="highlight">{selectedSeats.join(', ')}</span></p>
                        <p className="summary-item total-amount">Total: <span className="highlight">{totalPrice} EGP</span></p>
                    </div>

                    <div className="form-actions centered-buttons">
                        {/* ❌ REMOVED: Back button logic is now in NavHeader */}
                        
                        <button type="button" className="cancel-button" onClick={handleCancel} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="pay-button" disabled={loading}>
                            {loading ? 'Processing...' : `Pay ${totalPrice} EGP`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardDetails;