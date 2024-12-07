import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      {/*<h1>Filter</h1>*/}
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/configuration">Configuration</Link></li>
          <li><Link to="/traffic-simulation">Traffic Simulation</Link></li>
          <li><Link to="/performance-dashboard">Performance Dashboard</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/sidebar">Sidebar</Link></li> {/* Link to Testing page */}
          <li><Link to="/lab-dashboard">Lab Dashboard</Link></li>
          <li><Link to="/landing">Landing Page</Link></li>
          <li><Link to="/input">Input</Link></li>
          <li><Link to="/login-register">Login/Register</Link></li> {/* Link to Login/Register page */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
