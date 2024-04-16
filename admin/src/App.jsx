import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import { getCsrfToken } from './pages/utils';

const App = () => {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there's an authentication token in localStorage
    const authToken = localStorage.getItem('authToken');
    const csrfToken = getCsrfToken()
    if (authToken && csrfToken) {
      // If authToken exists, set isAuthenticated to true
      setIsAuthenticated(true);
    }
  }, []); // Run this effect only once on component mount

  // Function to set isAuthenticated to true after successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
