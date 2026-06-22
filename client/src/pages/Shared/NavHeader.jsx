import React from 'react';
import './NavHeader.css';
import logoImg from '../../assets/SeatScene logo.png'; // Ensure this path matches your logo image
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUser } from 'react-icons/fa'; // Import icons

// ==========================================================
// BACK BUTTON COMPONENT
// ==========================================================
// Designed to be fixed via CSS (using #back-btn ID)
const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Logic to determine if the back button should be hidden.
    // It's generally hidden when there's nowhere "safe" to go back to (e.g., the entry point).
    // Here, we hide it on the root path and authentication pages.
    const hideBackBtn = 
        location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/register';

    if (hideBackBtn) {
        return null;
    }

    const handleBack = () => {
        // Use navigate(-1) for standard back functionality within react-router-dom
        navigate(-1); 
        
        // Optional: Add the fade-out class to the body/root for the animation 
        // if you want the CSS fade effect from back-button.css to work.
        // This is necessary because we are overriding the JS file's DOM manipulation.
        document.documentElement.classList.add('site-fade-out');
        setTimeout(() => {
            document.documentElement.classList.remove('site-fade-out');
        }, 300); // 300ms is close to the CSS --fade-duration (280ms)
    };

    return (
        <button id="back-btn" onClick={handleBack} title="Go Back">
            <FaArrowLeft className="icon" />
            <span className="label">Back</span>
        </button>
    );
};


// ==========================================================
// MAIN NAV HEADER COMPONENT
// ==========================================================
const NavHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide button on login, register, any /admin route, and /profile
    const hideProfileBtn =
        location.pathname === '/login' ||
        location.pathname === '/register' ||
        location.pathname.startsWith('/admin') ||
        location.pathname === '/profile';

    const handleProfileClick = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/profile');
        }
    };

    const handleLogoClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/venue-selection');
        } else {
            navigate('/');
        }
    };

    return (
        <>
            {/* 1. Add the BackButton component before the nav element */}
            <BackButton />

            {/* 2. Main Navigation Bar */}
            <nav className="nav-header">
                <div className="logo-section" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <img src={logoImg} alt="Seat Scene Logo" className="logo-img" />
                </div>
                {!hideProfileBtn && (
                    <button className="profile-btn" onClick={handleProfileClick}>
                        <FaUser className="profile-icon" /> My Profile
                    </button>
                )}
            </nav>
        </>
    );
};

export default NavHeader;
