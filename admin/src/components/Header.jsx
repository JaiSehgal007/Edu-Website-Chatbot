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

  const handleChatDataDownload = async () => {
    try {
      // Send a GET request to fetch chat data as CSV
      const response = await axios.get('http://localhost:8000/api/chat-data/', {
        responseType: 'blob', // Set response type to blob for downloading file
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      });

      // Create a blob URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'chat_data.csv');
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading chat data:', error);
    }
  };

  const handlePerformanceDataDownload = async () => {
    try {
      // Send a GET request to fetch performance data as CSV
      const response = await axios.get('http://localhost:8000/api/performance-data/', {
        responseType: 'blob', // Set response type to blob for downloading file
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        }
      });

      // Create a blob URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'performance_data.csv');
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading performance data:', error);
    }
  };

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-bold">Doubt Assistant</div>
      <div>
        <span className="mr-4">Welcome, User!</span>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={handleChatDataDownload}>
          Chat Data
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={handlePerformanceDataDownload}>
          Performance Data
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
