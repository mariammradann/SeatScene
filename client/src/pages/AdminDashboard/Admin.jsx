import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaUsers, FaFilm, FaTheaterMasks, FaTicketAlt } from 'react-icons/fa';
import { FaRegUserCircle } from "react-icons/fa";
import { BiMovie } from "react-icons/bi";
import { FaMasksTheater } from "react-icons/fa6";
import { IoTicketSharp } from "react-icons/io5";
import { MdDashboardCustomize } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

// Assuming these forms are also fully functional with mock data
import AddMovieForm from './components/AddMovieForm'; 
import AddTheaterForm from './components/AddTheaterForm';
import EditMovieForm from './components/EditMovieForm';
import EditTheaterForm from './components/EditTheaterForm';

// ==========================================================
// 1. MOCK DATA STORE AND API FUNCTIONS (FRONTEND-ONLY)
//    - This simulates the entire backend CRUD layer.
// ==========================================================

const mockDataStore = {
  users: [
    { _id: 'u101', name: 'Alice Smith', email: 'alice@example.com', role: 'admin' },
    { _id: 'u102', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
    { _id: 'u103', name: 'Charlie Brown', email: 'charlie@example.com', role: 'user' },
  ],
  movies: [
    { _id: 'm201', title: 'The Matrix Resurrections', duration: 148, genre: 'Sci-Fi', capacity: 300, screenType: 'IMAX', amenities: ['Dolby Atmos'], releaseDate: '2021-12-22', posterUrl: 'url1' },
    { _id: 'm202', title: 'Dune: Part Two', duration: 166, genre: 'Adventure', capacity: 250, screenType: '3D', amenities: ['VIP Seating'], releaseDate: '2024-03-01', posterUrl: 'url2' },
  ],
  theaters: [
    { _id: 't301', name: 'Grand Cinema Downtown', location: '123 Main St', capacity: 800, screens: [{ number: 1, seats: 200 }, { number: 2, seats: 150 }], amenities: ['Dolby Atmos', 'Food Service'] },
    { _id: 't302', name: 'Northside Multiplex', location: '456 Oak Ave', capacity: 500, screens: [{ number: 1, seats: 100 }, { number: 2, seats: 80 }, { number: 3, seats: 70 }], amenities: ['Wheelchair Access'] },
  ],
  tickets: [
    { _id: 'k401', userId: 'u102', movieId: 'm201', theaterId: 't301', date: new Date().toISOString() },
    { _id: 'k402', userId: 'u103', movieId: 'm202', theaterId: 't302', date: new Date().toISOString() },
  ],
};

const mockApi = {
  // Global Stats Fetch
  fetchStats: () => new Promise(resolve => setTimeout(() => resolve({
    users: mockDataStore.users.length,
    movies: mockDataStore.movies.length,
    theaters: mockDataStore.theaters.length,
    tickets: mockDataStore.tickets.length,
  }), 500)),

  // Generic Read Operation
  fetch: (key) => new Promise(resolve => setTimeout(() => resolve([...mockDataStore[key]]) , 500)),
  
  // Generic Update Operation
  update: (key, id, updatedData) => new Promise(resolve => setTimeout(() => {
    const index = mockDataStore[key].findIndex(item => item._id === id);
    if (index !== -1) {
      mockDataStore[key][index] = { ...mockDataStore[key][index], ...updatedData };
      resolve(mockDataStore[key][index]);
    } else {
      resolve(null); // Simulate not found
    }
  }, 500)),

  // Generic Delete Operation
  delete: (key, id) => new Promise(resolve => setTimeout(() => {
    const initialLength = mockDataStore[key].length;
    mockDataStore[key] = mockDataStore[key].filter(item => item._id !== id);
    resolve({ success: mockDataStore[key].length < initialLength });
  }, 500)),
};


// ==========================================================
// 2. MANAGEMENT COMPONENTS
// ==========================================================

// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // MOCK API CALL
      const data = await mockApi.fetch('users');
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      // MOCK API CALL (PUT)
      const data = await mockApi.update('users', updatedUser._id, updatedUser);

      setUsers(prev => prev.map(user => 
        user._id === data._id ? data : user
      ));
      setEditingUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete user ${id}?`)) return;
    try {
      // MOCK API CALL (DELETE)
      await mockApi.delete('users', id);
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="management-section">
      <h2>User Management</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingUser && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>Edit User</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdateUser({
                _id: editingUser._id,
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role')
              });
            }}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={editingUser.name}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={editingUser.email}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  defaultValue={editingUser.role}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit">Update User</button>
                <button type="button" onClick={() => setEditingUser(null)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Movie Management Component
const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      // MOCK API CALL
      const data = await mockApi.fetch('movies');
      setMovies(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newMovie) => {
    // Manually add ID for new mocked items
    const movieWithId = { ...newMovie, _id: `m${Date.now()}` }; 
    mockDataStore.movies.push(movieWithId); // Update mock store
    setMovies(prev => [...prev, movieWithId]);
    setShowAddForm(false); // Close form on success
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
  };

  const handleUpdateSuccess = (updatedMovie) => {
    // We update the local state AND the global mock store.
    mockApi.update('movies', updatedMovie._id, updatedMovie);
    setMovies(prev => prev.map(movie => 
      movie._id === updatedMovie._id ? updatedMovie : movie
    ));
    setEditingMovie(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete movie ${id}?`)) return;
    try {
      // MOCK API CALL (DELETE)
      await mockApi.delete('movies', id);
      setMovies(prev => prev.filter(movie => movie._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading movies...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Movie Management</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
        >
          Add New Movie
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration</th>
              <th>Genre</th>
              <th>Capacity</th>
              <th>Screen Type</th>
              <th>Amenities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.duration} min</td>
                <td>{movie.genre}</td>
                <td>{movie.capacity}</td>
                <td>{movie.screenType}</td>
                <td>
                  <div className="amenities-list">
                    {movie.amenities?.map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleEdit(movie)}>Edit</button>
                    <button onClick={() => handleDelete(movie._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddForm && (
        <AddMovieForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddSuccess}
        />
      )}
      {editingMovie && (
        <EditMovieForm
          movie={editingMovie}
          onClose={() => setEditingMovie(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

// Theater Management Component
const TheaterManagement = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      setError(null);
      // MOCK API CALL
      const data = await mockApi.fetch('theaters');
      setTheaters(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newTheater) => {
    // Manually add ID for new mocked items
    const theaterWithId = { ...newTheater, _id: `t${Date.now()}` }; 
    mockDataStore.theaters.push(theaterWithId); // Update mock store
    setTheaters(prev => [...prev, theaterWithId]);
    setShowAddForm(false); // Close form on success
  };

  const handleEdit = (theater) => {
    setEditingTheater(theater);
  };

  const handleUpdateSuccess = (updatedTheater) => {
    // We update the local state AND the global mock store.
    mockApi.update('theaters', updatedTheater._id, updatedTheater);
    setTheaters(prev => prev.map(theater => 
      theater._id === updatedTheater._id ? updatedTheater : theater
    ));
    setEditingTheater(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete theater ${id}?`)) return;
    try {
      // MOCK API CALL (DELETE)
      await mockApi.delete('theaters', id);
      setTheaters(prev => prev.filter(theater => theater._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading theaters...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Theater Management</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
        >
          Add New Theater
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Screens</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map(theater => (
              <tr key={theater._id}>
                <td>{theater.name}</td>
                <td>{theater.location}</td>
                <td>{theater.capacity}</td>
                <td>
                  <div className="screens-list">
                    {theater.screens?.map((screen, index) => (
                      <span key={index} className="screen-tag">
                        Screen {screen.number} ({screen.seats} seats)
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleEdit(theater)}>Edit</button>
                    <button onClick={() => handleDelete(theater._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddForm && (
        <AddTheaterForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddSuccess}
        />
      )}
      {editingTheater && (
        <EditTheaterForm
          theater={editingTheater}
          onClose={() => setEditingTheater(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

// Ticket Management Component
const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      // MOCK API CALL
      const data = await mockApi.fetch('tickets');
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError(error.message || 'Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (id) => {
    console.log(`Mocking edit for ticket ID: ${id}.`);
    alert(`Editing ticket ${id} (Mock action). In a real app, this would open an Edit form.`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete ticket ${id}?`)) return;
    try {
        // MOCK API CALL (DELETE)
        await mockApi.delete('tickets', id);
        setTickets(prev => prev.filter(ticket => ticket._id !== id));
    } catch (error) {
        setError(error.message);
    }
  };

  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;


  return (
    <div className="management-section">
      <h2>Ticket Management</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Movie ID</th>
              <th>Theater ID</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket._id}</td>
                <td>{ticket.userId}</td>
                <td>{ticket.movieId}</td>
                <td>{ticket.theaterId}</td>
                <td>{new Date(ticket.date).toLocaleDateString()}</td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleEdit(ticket._id)}>Edit</button>
                    <button onClick={() => handleDelete(ticket._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================================
// 3. MAIN ADMIN COMPONENT
// ==========================================================

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    theaters: 0,
    tickets: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    // Re-fetch stats when returning to the dashboard to reflect changes made in management sections
    if (activeSection === 'dashboard') {
        fetchStats();
    }
  }, [activeSection]);

  const handleLogout = () => {
    // Standard frontend-only logout remains
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to a login page or home page after mock logout
    navigate('/'); 
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // MOCK API CALL
      const data = await mockApi.fetchStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p>{stats.users}</p>
                </div>
              </div>
              <div className="stat-card">
                <FaFilm className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Movies</h3>
                  <p>{stats.movies}</p>
                </div>
              </div>
              <div className="stat-card">
                <FaTheaterMasks className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Theaters</h3>
                  <p>{stats.theaters}</p>
                </div>
              </div>
              <div className="stat-card">
                <FaTicketAlt className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Tickets</h3>
                  <p>{stats.tickets}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'movies':
        return <MovieManagement />;
      case 'theaters':
        return <TheaterManagement />;
      case 'tickets':
        return <TicketManagement />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><RiAdminLine className="nav-icon" style={{ marginRight: '8px' }} /> Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <MdDashboardCustomize className="nav-icon" style={{ marginRight: '8px' }} />
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <FaRegUserCircle className="nav-icon" style={{ marginRight: '8px' }} />
            Users
          </button>
          <button 
            className={`nav-item ${activeSection === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveSection('movies')}
          >
            <BiMovie className="nav-icon" style={{ marginRight: '8px' }} />
            Movies
          </button>
          <button 
            className={`nav-item ${activeSection === 'theaters' ? 'active' : ''}`}
            onClick={() => setActiveSection('theaters')}
          >
            <FaMasksTheater className="nav-icon" style={{ marginRight: '8px' }} />
            Theaters
          </button>
          <button 
            className={`nav-item ${activeSection === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveSection('tickets')}
          >
            <IoTicketSharp className="nav-icon" style={{ marginRight: '8px' }} />
            Tickets
          </button>
          <button 
            className="nav-item logout-button"
            onClick={handleLogout}
          >
            <IoLogOut className="nav-icon" style={{ marginRight: '8px' }} />
            Logout
          </button>
        </nav>
      </div>
      <main className="main-content">
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
        {loading && activeSection === 'dashboard' ? (
          <div className="loading">Loading dashboard stats...</div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default Admin;