import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// --- Mock Data and Configuration ---

// Configuration to simulate login response
// Set to 'success' or 'fail' to test different paths
const MOCK_LOGIN_STATUS = 'success'; 
const MOCK_DELAY_MS = 500; // Simulate network latency

// Mock user data returned on success
const MOCK_USER_DATA = {
    id: 'user-123',
    email: 'mock@example.com',
    name: 'Mock User',
    role: 'customer', // Use 'admin' here to test the AdminRoute
};

// Mock token
const MOCK_TOKEN = 'mock-jwt-token-1234567890';

// ------------------------------------

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // --- EDITED: Removed all validation and forced immediate success logic ---
        
        // 1. Simulate API call delay
        setTimeout(() => {
            setIsLoading(false);
            
            // Force Success Path
            const mockData = {
                token: MOCK_TOKEN,
                user: { 
                    ...MOCK_USER_DATA, 
                    email: email || 'quicklogin@test.com' // Use a placeholder email if input is empty
                }
            };

            // 2. Save mock token and user data
            localStorage.setItem('token', mockData.token);
            localStorage.setItem('user', JSON.stringify(mockData.user));
            
            console.log('Quick Login Success! Navigating to home.');
            navigate('/'); // Navigate on success
            
        }, MOCK_DELAY_MS); // Apply the simulated network delay
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Sign in (Quick Access Mode)</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address (Optional for Quick Login)
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            // Removed 'required' attribute
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password (Optional for Quick Login)
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            // Removed 'required' attribute
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {isLoading ? 'Signing In...' : 'Quick Sign in'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register here
                        </Link>
                    </p>
                    <p className="text-xs text-red-500 mt-2 p-1 border-t border-dashed">
                        **Quick Login Enabled**
                        <br />
                        Click 'Quick Sign in' to bypass credentials and navigate to the home page.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
