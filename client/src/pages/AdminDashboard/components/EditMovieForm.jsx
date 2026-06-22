import React, { useState } from 'react';
import './Forms.css';

/**
 * Mock function to simulate deleting a movie.
 * @param {string} movieId - The ID of the movie being deleted.
 * @returns {Promise<object>} A promise that resolves with a success message.
 */
const mockDeleteMovie = (movieId) => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      console.log(`Mocking successful deletion for movie ID: ${movieId}`);
      // Simulate the backend response indicating success
      resolve({ 
        message: `Movie with ID ${movieId} successfully deleted (Mocked).`,
        deletedId: movieId 
      });
    }, 500); // 500ms delay
  });
};

const DeleteMovieButton = ({ movie, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the movie: ${movie.title}?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // **BACKEND API CALL REMOVED, USING MOCK FUNCTION**
      // Call the mock function instead of the real API
      const result = await mockDeleteMovie(movie._id);

      // Call the success handler, passing the ID of the deleted movie
      // The parent component should now use this ID to update its local state (e.g., filter the movie out of its list)
      onDeleteSuccess(movie._id);

    } catch (err) {
      // Mock failure could be added to mockDeleteMovie if needed
      setError('Mock deletion failed. See console for details.'); 
      console.error('Mock Delete Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="error-message">{error}</p>}
      <button 
        onClick={handleDelete} 
        disabled={loading}
        className="delete-button" // Assuming a class for styling
      >
        {loading ? 'Deleting...' : 'Delete Movie'}
      </button>
    </div>
  );
};

export default DeleteMovieButton;