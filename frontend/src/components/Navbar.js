import React, { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const [filterType, setFilterType] = useState("stateless");
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [selectedAttacks, setSelectedAttacks] = useState([]);
  const [isAlgorithmDropdownOpen, setAlgorithmDropdownOpen] = useState(false);
  const [isAttackDropdownOpen, setAttackDropdownOpen] = useState(false);

  const mlAlgorithms = ["SVM", "Random Forest", "XGBoost", "KNN", "LightGBM"];
  const attackTypes = ["SQL Injection", "DNS Server", "DoS", "Man-in-the-Middle"];

  // Handle checkbox changes for ML Algorithms
  const handleAlgorithmCheckboxChange = (algorithm) => {
    if (selectedAlgorithms.includes(algorithm)) {
      setSelectedAlgorithms(selectedAlgorithms.filter((item) => item !== algorithm));
    } else {
      setSelectedAlgorithms([...selectedAlgorithms, algorithm]);
    }
  };

  // Toggle dropdown for ML Algorithms
  const toggleAlgorithmDropdown = (e) => {
    e.stopPropagation();
    if (filterType !== "stateless") {
      setAlgorithmDropdownOpen((prev) => !prev);
    }
  };

  // Toggle dropdown for Attacks
  const toggleAttackDropdown = (e) => {
    e.stopPropagation();
    setAttackDropdownOpen((prev) => !prev);
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
            setSelectedAlgorithms([]);
            setSelectedAttacks([]);
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
          onClick={toggleAlgorithmDropdown}
        >
          <div className="dropdown-header">
            {filterType === "stateless" ? (
              "None"
            ) : selectedAlgorithms.length === 0 ? (
              "None"
            ) : (
              selectedAlgorithms.join(", ")
            )}
            <span className="dropdown-arrow">&#9660;</span>
          </div>
          {isAlgorithmDropdownOpen && filterType !== "stateless" && (
            <ul
              className="dropdown-list"
              onClick={(e) => e.stopPropagation()}
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

      {/* Attacks Dropdown */}
      <div className="navbar-item">
        <label htmlFor="attacks" className="navbar-label">
          Attacks:
        </label>
        <div
          className={`custom-dropdown ${isAttackDropdownOpen ? "open" : ""}`}
          onClick={toggleAttackDropdown}
        >
          <div className="dropdown-header">
            {selectedAttacks.length === 0 ? "None" : selectedAttacks.join(", ")}
            <span className="dropdown-arrow">&#9660;</span>
          </div>
          {isAttackDropdownOpen && (
            <ul
              className="dropdown-list"
              onClick={(e) => e.stopPropagation()}
            >
              {attackTypes.map((attack, index) => (
                <li key={index} className="dropdown-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedAttacks.includes(attack)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAttacks([...selectedAttacks, attack]);
                        } else {
                          setSelectedAttacks(
                            selectedAttacks.filter((item) => item !== attack)
                          );
                        }
                      }}
                    />
                    {attack}
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
