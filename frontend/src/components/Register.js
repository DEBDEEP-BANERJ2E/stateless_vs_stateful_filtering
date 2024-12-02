import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css'; // Ensure the styles are properly linked

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Handle input changes for username, password, and email
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!username || !password || !email) {
      setMessage('All fields are required!');
      setIsError(true);
      return;
    }

    console.log('Registering with:', { username, password, email });

    try {
      // Send a POST request to the backend API for registration
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        username,
        password,
        email,
      });

      if (response.status === 201) { // Use 201 for created resource
        setMessage('Registration successful! You can now log in.');
        setIsError(false);
        // Optionally, redirect to the login page
        setTimeout(() => {
          window.location.href = '/login'; // Replace with your login page URL
        }, 2000);
      }
    } catch (error) {
      console.error('Error registering:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message); // Show backend error messages
      } else {
        setMessage('Registration failed. Please try again.');
      }
      setIsError(true);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
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

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
