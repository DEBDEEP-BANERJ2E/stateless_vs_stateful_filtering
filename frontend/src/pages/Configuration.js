import React, { useState } from "react";

function Configuration() {
  const [clubType, setClubType] = useState("web-server");
  const [filteringMode, setFilteringMode] = useState("stateful");

  const handleSubmit = () => {
    console.log(`Club Type: ${clubType}, Filtering Mode: ${filteringMode}`);
  };

  return (
    <div className="configuration">
      <h2>Configuration</h2>
      <label>
        Select Club Type:
        <select value={clubType} onChange={(e) => setClubType(e.target.value)}>
          <option value="web-server">Web Server</option>
          <option value="database">Database</option>
          <option value="file-server">File Server</option>
        </select>
      </label>
      <label>
        Filtering Mode:
        <select value={filteringMode} onChange={(e) => setFilteringMode(e.target.value)}>
          <option value="stateful">Stateful</option>
          <option value="stateless">Stateless</option>
        </select>
      </label>
      <button onClick={handleSubmit}>Submit Configuration</button>
    </div>
  );
}

export default Configuration;
