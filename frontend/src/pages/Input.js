import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../styles/Input.css';

const Input = () => {
  const [inputs, setInputs] = useState({
    trafficType: '',
    filterMode: 'stateful',
    testDuration: 30,
    trafficVolume: 'light',
    numConnections: 1,
    protocol: 'TCP',
    networkTopology: 'client-server',
    packetSize: 'small',
    latency: false,
    packetLoss: false,
    bandwidthLimit: 1000,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send the inputs to your benchmarking tool or server
    console.log(inputs);
  };

  return (
    <div className="input-page">
      <div className="input-container">
        <h2>Performance Benchmarking Tool</h2>
        <form onSubmit={handleSubmit}>
          {/* Traffic Type */}
          <div className="form-group">
            <label htmlFor="trafficType">Traffic Type</label>
            <select
              id="trafficType"
              name="trafficType"
              value={inputs.trafficType}
              onChange={handleInputChange}
            >
              <option value="short-lived">Short-lived Connections</option>
              <option value="long-lived">Long-lived Connections</option>
              <option value="long-lived">Mix of Both</option>
            </select>
          </div>

          {/* Filter Mode */}
          <div className="form-group">
            <label>Filter Mode</label>
            <div>
              <input
                type="radio"
                id="stateful"
                name="filterMode"
                value="stateful"
                checked={inputs.filterMode === 'stateful'}
                onChange={handleInputChange}
              />
              <label htmlFor="stateful">Stateful</label>
              <input
                type="radio"
                id="stateless"
                name="filterMode"
                value="stateless"
                checked={inputs.filterMode === 'stateless'}
                onChange={handleInputChange}
              />
              <label htmlFor="stateless">Stateless</label>
              <input
                type="radio"
                id="both"
                name="filterMode"
                value="both"
                checked={inputs.filterMode === 'both'}
                onChange={handleInputChange}
              />
              <label htmlFor="both">Both</label>
            </div>
          </div>

          {/* Test Duration */}
          <div className="form-group">
            <label htmlFor="testDuration">Test Duration (seconds)</label>
            <input
              type="number"
              id="testDuration"
              name="testDuration"
              min="10"
              max="600"
              value={inputs.testDuration}
              onChange={handleInputChange}
            />
          </div>

          {/* Traffic Volume */}
          <div className="form-group">
            <label htmlFor="trafficVolume">Traffic Volume</label>
            <select
              id="trafficVolume"
              name="trafficVolume"
              value={inputs.trafficVolume}
              onChange={handleInputChange}
            >
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
              <option value="all">All</option>
            </select>
          </div>

          {/* Number of Connections */}
          <div className="form-group">
            <label htmlFor="numConnections">Number of Connections</label>
            <input
              type="number"
              id="numConnections"
              name="numConnections"
              min="1"
              max="100"
              value={inputs.numConnections}
              onChange={handleInputChange}
            />
          </div>

          {/* Protocol */}
          <div className="form-group">
            <label htmlFor="protocol">Protocol</label>
            <select
              id="protocol"
              name="protocol"
              value={inputs.protocol}
              onChange={handleInputChange}
            >
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="ICMP">ICMP</option>
            </select>
          </div>

          {/* Network Topology */}
          <div className="form-group">
            <label htmlFor="networkTopology">Network Topology</label>
            <select
              id="networkTopology"
              name="networkTopology"
              value={inputs.networkTopology}
              onChange={handleInputChange}
            >
              <option value="client-server">Client-Server</option>
              <option value="multi-node">Multi-node</option>
            </select>
          </div>

          {/* Packet Size */}
          <div className="form-group">
            <label htmlFor="packetSize">Packet Size</label>
            <select
              id="packetSize"
              name="packetSize"
              value={inputs.packetSize}
              onChange={handleInputChange}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="all">All</option>
            </select>
          </div>

          {/* Network Conditions */}
          <div className="form-group">
            <label htmlFor="latency">
              <input
                type="checkbox"
                id="latency"
                name="latency"
                checked={inputs.latency}
                onChange={handleInputChange}
              />
              Simulate Network Latency
            </label>
            <label htmlFor="packetLoss">
              <input
                type="checkbox"
                id="packetLoss"
                name="packetLoss"
                checked={inputs.packetLoss}
                onChange={handleInputChange}
              />
              Simulate Packet Loss
            </label>
          </div>

          {/* Bandwidth Limit */}
          <div className="form-group">
            <label htmlFor="bandwidthLimit">Bandwidth Limit (Mbps)</label>
            <input
              type="number"
              id="bandwidthLimit"
              name="bandwidthLimit"
              min="10"
              max="10000"
              value={inputs.bandwidthLimit}
              onChange={handleInputChange}
            />
          </div>

          {/* "Create a Lab" button now wrapped with Link */}
          <div className="button-container">
          <Link to="/lab-projects">
            <button type="button" className="submit-button">
              Create a Lab
            </button>
          </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Input;
