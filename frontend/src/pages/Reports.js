import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [benchmarkData, setBenchmarkData] = useState([]);
  const [benchmarkInsights, setBenchmarkInsights] = useState({});
  const [benchmarkInferences, setBenchmarkInferences] = useState({});

  // Fetch the data when the component mounts
  useEffect(() => {
    fetch('http://localhost:8005/data')  // Replace with your Flask server URL
      .then(response => response.json())
      .then(data => setBenchmarkData(data));

    // Initially fetch the benchmark insights
    fetchBenchmarkInsights();
  }, []);

  // Function to fetch benchmark insights and inferences from the backend
  const fetchBenchmarkInsights = () => {
    fetch('http://localhost:8006/api/insights')  // Replace with your Flask API URL for insights
      .then(response => response.json())
      .then(data => {
        setBenchmarkInsights(data.insights || {});
        setBenchmarkInferences(data.inferences || {});
      })
      .catch(error => {
        console.error('Error fetching insights:', error);
        alert('Error fetching insights');
      });
  };

  const handleSave = () => {
    fetch('http://localhost:8005/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_name: 'benchmark_data.json' }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message || 'Data saved successfully!');
      })
      .catch(error => {
        console.error('Error saving data:', error);
        alert('Error saving data');
      });
  };

  // Function to highlight specific terms in the inference text
  const highlightInferences = (text) => {
    const regex = /(extremely high|significantly higher|moderately higher|slightly higher|moderately better|significantly better|extremely low|outstanding|superior|exceptional)/gi;
    return text.split(regex).map((part, index) => {
      if (regex.test(part)) {
        return (
          <span key={index} style={{ color: 'red', fontWeight: 'bold' }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div>
      <h1>Benchmark Reports</h1>
      <table style={{ marginLeft: '20px' }}>
        <thead>
          <tr>
            <th>Time Interval (s)</th>
            <th>Latency (Stateful)</th>
            <th>Latency (Stateless)</th>
            <th>Throughput (Stateful)</th>
            <th>Throughput (Stateless)</th>
            <th>CPU Usage (Stateful)</th>
            <th>CPU Usage (Stateless)</th>
            <th>Memory Usage (Stateful)</th>
            <th>Memory Usage (Stateless)</th>
          </tr>
        </thead>
        <tbody>
          {benchmarkData && benchmarkData.latency_stateful && benchmarkData.latency_stateful.map((_, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{benchmarkData.latency_stateful[index]}</td>
              <td>{benchmarkData.latency_stateless[index]}</td>
              <td>{benchmarkData.throughput_stateful[index]}</td>
              <td>{benchmarkData.throughput_stateless[index]}</td>
              <td>{benchmarkData.cpu_usage_stateful[index]}</td>
              <td>{benchmarkData.cpu_usage_stateless[index]}</td>
              <td>{benchmarkData.memory_usage_stateful[index]}</td>
              <td>{benchmarkData.memory_usage_stateless[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSave}>Save Data</button>
      <button onClick={fetchBenchmarkInsights}>Refresh Insights</button>

      {/* Display the Benchmark Insights and Inferences below the table */}
      {Object.keys(benchmarkInsights).length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h2>Benchmark Insights</h2>
          <ul>
            {Object.entries(benchmarkInsights).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value.toFixed(9)}% {/* Updated to 4 decimal places */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(benchmarkInferences).length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h2>Benchmark Inferences</h2>
          <ul>
            {Object.entries(benchmarkInferences).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {highlightInferences(value)} {/* Displaying inferences with highlighted terms */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reports;
