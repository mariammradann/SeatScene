import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa'; // Added icons
import { toast, ToastContainer } from 'react-toastify'; // Added Toast for user feedback
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css'; // Assuming Register uses the same Auth.css

// ==========================================================
// MOCK DATA STORE & API (FRONTEND-ONLY SIMULATION)
// ==========================================================

// Mock storage for registered users (in a real app, this would be a database)
const mockRegisteredUsers = [
    { email: 'admin@seats.com', name: 'Admin User', role: 'admin', _id: 'u001' },
    { email: 'user@seats.com', name: 'Regular User', role: 'user', _id: 'u002' },
];

/**
 * Simulates a call to the /api/auth/register endpoint.
 * @param {object} userData - { name, email, password }
 */
const mockRegisterApi = (userData) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const { email, name } = userData;
      
      // 1. Check for existing email (Uniqueness validation)
      if (mockRegisteredUsers.some(u => u.email === email)) {
        reject({ status: 409, message: 'Registration failed. Email is already in use.' });
        return;
      }
      
      // 2. Successful registration simulation (201 Created)
      const newUserId = `u${Date.now()}`;
      const mockToken = `mockToken.${newUserId}.${Math.random().toString(36).substring(2)}`;
      
      const newUser = {
          _id: newUserId,
          email: email,
          name: name,
          role: 'user' // Default role for new registrations
      };
      
      // Add new user to mock store (for immediate testing purposes)
      mockRegisteredUsers.push(newUser);

      resolve({ 
        status: 201, 
        data: { 
          message: 'Registration successful!',
          token: mockToken, 
          user: newUser 
        } 
      });

    }, 1200); // 1.2 second delay
  });
};

// ==========================================================
// REACT COMPONENT
// ==========================================================

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error message when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // --- Frontend Validations ---
    if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setError('Passwords do not match');
        setLoading(false);
        return;
    }

    if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
    }
    // --- End Frontend Validations ---

    const loadingToast = toast.loading('Creating account...');

    try {
      // 🚨 MOCK API CALL REPLACEMENT 🚨
      const response = await mockRegisterApi({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      const data = response.data;
      
      // Store the mock token and user data (Optional for registration, often we redirect to login)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Show success toast
      toast.dismiss(loadingToast);
      toast.success('Registration successful! Redirecting to login...');

      // Navigate to login page after successful registration
      setTimeout(() => navigate('/login'), 1500); 

    } catch (mockError) {
      console.error('Registration error:', mockError);
      const errorMessage = mockError.message || 'An unknown error occurred during registration.';
      
      toast.dismiss(loadingToast);
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Toast Container for notifications */}
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
        <h2>Create an Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="2"
                placeholder="Enter your full name"
              />
              <FaUser className="input-icon" />
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
              <FaEnvelope className="input-icon" />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Enter your password"
              />
              <FaLock className="input-icon" />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Confirm your password"
              />
              <FaLock className="input-icon" />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className={`auth-button ${loading ? 'loading' : ''}`}>
            <FaUserPlus className="button-icon" />
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Switch to Login */}
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;