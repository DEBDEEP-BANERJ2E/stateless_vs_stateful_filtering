import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css'; // Corrected import for CSS

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Handle username and password change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Both fields are required!');
      setIsError(true);
      return;
    }

    console.log('Logging in with:', { username, password });

    try {
      // Send a POST request to the backend API
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        username,
        password
      });

      if (response.status === 200) {
        setMessage('Login successful!');
        setIsError(false);
        // Optionally redirect the user to another page after successful login
        window.location.href = '/dashboard'; // Replace with your desired route
      } else {
        setMessage('Login failed. Please check your credentials.');
        setIsError(true);
      }
    } catch (error) {
      // Network error or wrong API endpoint handling
      console.error('Error logging in:', error);
      if (error.response) {
        // Backend returned an error
        setMessage(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        // Network error
        setMessage('Network error. Please try again later.');
      }
      setIsError(true);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {message && <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
