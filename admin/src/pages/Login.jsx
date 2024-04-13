import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to the /api/register/ endpoint
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
      });

      // Handle the response
      const { token } = response.data;
      // Store the token in local storage or state management library
      localStorage.setItem('authToken', token);
      // Redirect to the desired page or show a success message
      console.log('Login successful!');
    } catch (error) {
      // Handle the error
      console.error('Error during login:', error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', { username, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token } = response.data;
      localStorage.setItem('authToken', token);
      console.log('Login successful!');
      // Call onLoginSuccess to set isAuthenticated to true
      onLoginSuccess();
    } catch (error) {
      console.error('Error during login:', error.response.data);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;