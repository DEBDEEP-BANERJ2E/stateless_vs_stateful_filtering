import React, { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const [filterType, setFilterType] = useState("stateless");
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [isAlgorithmDropdownOpen, setAlgorithmDropdownOpen] = useState(false);

  const mlAlgorithms = ["Algorithm A", "Algorithm B", "Algorithm C"];

  // Handle checkbox changes
  const handleAlgorithmCheckboxChange = (algorithm) => {
    if (selectedAlgorithms.includes(algorithm)) {
      // Remove the algorithm if already selected
      setSelectedAlgorithms(selectedAlgorithms.filter((item) => item !== algorithm));
    } else {
      // Add the algorithm to the selected list
      setSelectedAlgorithms([...selectedAlgorithms, algorithm]);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    // Allow dropdown to open only if filterType is not "stateless"
    if (filterType !== "stateless") {
      setAlgorithmDropdownOpen((prev) => !prev);
    }
  };

  return (
    <nav className="navbar">
      {/* Filtering Type Dropdown */}
      <div className="navbar-item">
        <label htmlFor="filter-type" className="navbar-label">
          Filtering Type:
        </label>
        <select
          id="filter-type"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setSelectedAlgorithms([]); // Reset selected algorithms on filter change
          }}
          className="navbar-select"
        >
          <option value="stateless">Stateless</option>
          <option value="stateful">Stateful</option>
          <option value="both">Both</option>
        </select>
      </div>

      {/* ML Algorithm Dropdown */}
      <div className="navbar-item">
        <label htmlFor="ml-algorithm" className="navbar-label">
          ML Algorithm:
        </label>
        <div
          className={`custom-dropdown ${isAlgorithmDropdownOpen ? "open" : ""}`}
          onClick={toggleDropdown}
        >
          <div className="dropdown-header">
            {filterType === "stateless" ? (
              "None"
            ) : (
              selectedAlgorithms.length === 0 ? "None" : selectedAlgorithms.join(", ")
            )}
            <span className="dropdown-arrow">&#9660;</span>
          </div>
          {isAlgorithmDropdownOpen && filterType !== "stateless" && (
            <ul
              className="dropdown-list"
              onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking inside
            >
              {mlAlgorithms.map((algo, index) => (
                <li key={index} className="dropdown-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedAlgorithms.includes(algo)}
                      onChange={() => handleAlgorithmCheckboxChange(algo)}
                    />
                    {algo}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Input Type Dropdown */}
      <div className="navbar-item">
        <label htmlFor="input-type" className="navbar-label">
          Input Type:
        </label>
        <select id="input-type" className="navbar-select">
          <option value="server">Server</option>
          <option value="client">Client</option>
          <option value="ip-address">IP Address</option>
          <option value="database">Database</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
