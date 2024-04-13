import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';

const App = () => {
  // Check if the user is authenticated
  const isAuthenticated = false; // Replace with your authentication logic

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Login />}
        />
      </Routes>
    </Router>
  );
};

export default App;