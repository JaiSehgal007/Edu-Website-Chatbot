import React from 'react';
import axios from 'axios'; // Import axios

const Header = () => {
  const handleLogout = async () => {
    try {
      // Send a DELETE request to the logout endpoint
      await axios.delete('http://localhost:8000/api/logout/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      });

      // Clear the authentication token from localStorage
      localStorage.removeItem('authToken');

      // Redirect to the login page
      window.location.href = '/'; // Redirect manually
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-bold">Doubt Assistant</div>
      <div>
        <span className="mr-4">Welcome, User!</span>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
