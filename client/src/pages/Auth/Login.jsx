import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';

// ==========================================================
// MOCK DATA STORE & API (FRONTEND-ONLY SIMULATION)
// ==========================================================

const mockUsers = [
  // Admin User: password is 'adminpass'
  { email: 'admin@seats.com', password: 'adminpass', role: 'admin', name: 'Admin User', _id: 'u001' },
  // Regular User: password is 'userpass'
  { email: 'user@seats.com', password: 'userpass', role: 'user', name: 'Regular User', _id: 'u002' },
];

/**
 * Simulates a call to the /api/auth/login endpoint.
 * @param {object} credentials - { email, password }
 */
const mockLoginApi = (credentials) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const { email, password } = credentials;
      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        // 404/401 Not Found/Unauthorized
        reject({ status: 404, message: 'Invalid credentials. User not found.' });
        return;
      }

      // In a real app, this would be a password hash comparison
      if (user.password !== password) {
        // 401 Unauthorized
        reject({ status: 401, message: 'Invalid email or password.' });
        return;
      }

      // Successful login simulation (200 OK)
      const mockToken = `mockToken.${user._id}.${Math.random().toString(36).substring(2)}`;
      
      // Return a clean user object without the password
      const userToReturn = { 
          _id: user._id, 
          email: user.email, 
          role: user.role,
          name: user.name
      };

      resolve({ 
        status: 200, 
        data: { 
          token: mockToken, 
          user: userToReturn 
        } 
      });

    }, 1000); // 1 second delay
  });
};

// ==========================================================
// REACT COMPONENT
// ==========================================================

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cleanup: Simplified useEffect to only check for existing sessions
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        // Optional: Can redirect automatically if a token is found
        // For now, we'll leave it to allow testing the login form.
        console.log("Existing token found. You may already be logged in.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Show loading toast
    const loadingToast = toast.loading('Logging in...');

    try {
      // 🚨 BYPASS ALL CREDENTIAL CHECKING - ACCEPT ANY INPUT 🚨
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user data with any credentials provided
      const mockToken = `mockToken.${Date.now()}.${Math.random().toString(36).substring(2)}`;
      
      // Determine role based on email (if it contains 'admin', make them admin)
      const isAdmin = formData.email && formData.email.toLowerCase().includes('admin');
      const userRole = isAdmin ? 'admin' : 'user';
      
      const mockUser = {
        _id: 'user-' + Date.now(),
        email: formData.email || 'quicklogin@test.com',
        role: userRole,
        name: formData.email ? formData.email.split('@')[0] : 'Quick User'
      };

      // Store the mock token and user data
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Show success toast
      toast.dismiss(loadingToast);
      toast.success('Login successful!');

      // Redirect based on user role
      if (userRole === 'admin') {
        toast.info('Redirecting to admin dashboard...');
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        toast.info('Redirecting to venue selection...');
        setTimeout(() => navigate('/venue-selection'), 1000);
      }

    } catch (error) {
      console.error('Login error:', error);
      
      // This should never happen now, but just in case
      const errorMessage = 'An unexpected error occurred.';
      
      toast.dismiss(loadingToast);
      toast.error(errorMessage);
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="auth-form-container">
        <h2>Login to SeatScene</h2>
        <p style={{color: '#10b981', fontSize: '14px', marginBottom: '20px', textAlign: 'center'}}>
          ✅ Quick Login Mode: Enter any credentials to access the app<br/>
          <small style={{color: '#6b7280', fontSize: '12px'}}>
            Tip: Use an email with 'admin' to access admin dashboard
          </small>
        </p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter any email (optional)"
                autoComplete="off"
              />
              <FaEnvelope className="input-icon" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter any password (optional)"
                autoComplete="off"
              />
              <FaLock className="input-icon" />
            </div>
          </div>
          <button type="submit" disabled={loading} className={`auth-button ${loading ? 'loading' : ''}`}>
            <FaSignInAlt className="button-icon" />
            {loading ? 'Logging in...' : 'Quick Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;