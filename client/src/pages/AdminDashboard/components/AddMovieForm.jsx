// src/components/AddMovieForm.jsx
import React, { useState } from 'react';
import './Forms.css';

const AddMovieForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    genre: '',
    releaseDate: '',
    posterImage: null,
    capacity: '',
    screenType: '2D',
    amenities: [],
    showtimes: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [newShowtime, setNewShowtime] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleAddShowtime = () => {
    if (newShowtime.trim()) {
      setFormData((prev) => ({
        ...prev,
        showtimes: [...prev.showtimes, newShowtime.trim()],
      }));
      setNewShowtime('');
    }
  };

  const handleRemoveShowtime = (index) => {
    setFormData((prev) => ({
      ...prev,
      showtimes: prev.showtimes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // **REPLACED BACKEND CALL WITH MOCK FUNCTION**
      // The mockAddMovie function is now the only source of "data"
      const data = await mockAddMovie(formData);

      onSuccess(data);
      onClose();
    } catch (error) {
      // The mock function should handle mock errors, but this ensures a fallback
      setError(error.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Add New Movie</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseDate">Release Date</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="posterImage">Movie Poster</label>
            <input
              type="file"
              id="posterImage"
              name="posterImage"
              accept="image/*"
              onChange={handleChange}
              required
            />
            {formData.posterImage && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(formData.posterImage)}
                  alt="Poster preview"
                  style={{ maxWidth: '200px', marginTop: '10px' }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="screenType">Screen Type</label>
            <select
              id="screenType"
              name="screenType"
              value={formData.screenType}
              onChange={handleChange}
              required
            >
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
              <option value="4DX">4DX</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div className="amenities-input">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add an amenity"
              />
              <button type="button" onClick={handleAddAmenity}>Add</button>
            </div>
            <div className="amenities-list">
              {formData.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="remove-amenity"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Showtimes</label>
            <div className="amenities-input">
              <input
                type="datetime-local"
                value={newShowtime}
                onChange={(e) => setNewShowtime(e.target.value)}
                placeholder="Add a showtime"
              />
              <button type="button" onClick={handleAddShowtime}>Add</button>
            </div>
            <div className="amenities-list">
              {formData.showtimes.map((showtime, index) => (
                <span key={index} className="amenity-tag">
                  {new Date(showtime).toLocaleString()}
                  <button
                    type="button"
                    onClick={() => handleRemoveShowtime(index)}
                    className="remove-amenity"
                  >
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Movie'}
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieForm;