import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <nav>
        <ul>
        <h1><Link to="/">FilterBench</Link></h1>
          <li><Link to="/performance-dashboard">Performance Dashboard</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/lab-dashboard">Lab Dashboard</Link></li>
          <li><Link to="/lab-projects">Lab Projects</Link></li>
          <li><Link to="/network">Network Performance Analysis</Link></li>
          <li><Link to="/traffic-simulation">Traffic Simulation</Link></li>
          <li><Link to="/input">Input</Link></li>
          <li><Link to="/login-register">Login/Register</Link></li> {/* Link to Login/Register page */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
