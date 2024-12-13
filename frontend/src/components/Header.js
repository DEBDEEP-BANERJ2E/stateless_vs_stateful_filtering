import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons"; // Import the user icon
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <h1>
        <Link to="/">FilterBench</Link>
      </h1>
      <nav>
        <ul>
          <li>
            <Link to="/input">Input</Link>
          </li>
          {/*<li>
            <Link to="/home">Home</Link>
          </li>*/}
          <li>
            <Link to="/lab-projects">Lab Projects</Link>
          </li>
          <li>
            <Link to="/lab-dashboard">Lab Dashboard</Link>
          </li>
          <li>
            <Link to="/traffic-simulation">Traffic Simulation</Link>
          </li>
          <li>
            <Link to="/reports">Normal Reports</Link>
          </li>
          <li>
            <Link to="/reports1">Reports on RF</Link>
          </li>
          <li>
            <Link to="/benchmarking">Network Performance Analysis</Link>
          </li>
          <li>
            <Link to="/random-forest">NPA with RF</Link>
          </li>
          <li>
            <Link to="/login-register">
              <FontAwesomeIcon icon={faUserCircle} className="login-icon" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
