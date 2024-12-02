import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import '../styles/LoginRegister.css';

function LoginRegister() {
  const [showLogin, setShowLogin] = useState(true);

  // Toggle between login and register forms
  const toggleForm = () => {
    setShowLogin((prevState) => !prevState);
  };

  return (
    <div className="login-register">
      <div className="form-toggle">
        <button onClick={toggleForm}>
          {showLogin
            ? "Don't have an account? Register here"
            : "Already have an account? Login here"}
        </button>
      </div>
      <div className="form-container">
        {showLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
}

export default LoginRegister;
