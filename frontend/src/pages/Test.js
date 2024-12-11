import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/BenchmarkingChart.module.css'; // Import the CSS file

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BenchmarkingChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [tableData, setTableData] = useState([]);
  const [benchmarkingStopped, setBenchmarkingStopped] = useState(false);
  const [intervalId, setIntervalId] = useState(null); // Track interval

  const fetchData = async () => {
    const response = await fetch('http://localhost:8005/data'); // Updated API URL
    const data = await response.json();
    return data;
  };

  const updateChart = useCallback(async () => {
    if (benchmarkingStopped) return; // Stop updates if benchmarking has stopped

    const data = await fetchData();

    const updatedData = {
      labels: Array.from({ length: data.latency_stateful.length }, (_, i) => i + 1),
      datasets: [
        {
          label: 'Latency (Stateful)',
          data: data.latency_stateful,
          borderColor: 'blue',
          fill: false
        },
        {
          label: 'Latency (Stateless)',
          data: data.latency_stateless,
          borderColor: 'orange',
          fill: false
        },
        {
          label: 'Throughput (Stateful)',
          data: data.throughput_stateful,
          borderColor: 'green',
          fill: false
        },
        {
          label: 'Throughput (Stateless)',
          data: data.throughput_stateless,
          borderColor: 'red',
          fill: false
        },
        {
          label: 'CPU Usage (Stateful)',
          data: data.cpu_usage_stateful,
          borderColor: 'purple',
          fill: false
        },
        {
          label: 'CPU Usage (Stateless)',
          data: data.cpu_usage_stateless,
          borderColor: 'cyan',
          fill: false
        },
        {
          label: 'Memory Usage (Stateful)',
          data: data.memory_usage_stateful,
          borderColor: 'brown',
          fill: false
        },
        {
          label: 'Memory Usage (Stateless)',
          data: data.memory_usage_stateless,
          borderColor: 'pink',
          fill: false
        }
      ]
    };

    setChartData(updatedData);

    setTableData((prevData) => [
      ...prevData,
      {
        latency_stateful: data.latency_stateful[data.latency_stateful.length - 1],
        latency_stateless: data.latency_stateless[data.latency_stateless.length - 1],
        throughput_stateful: data.throughput_stateful[data.throughput_stateful.length - 1],
        throughput_stateless: data.throughput_stateless[data.throughput_stateless.length - 1],
        cpu_usage_stateful: data.cpu_usage_stateful[data.cpu_usage_stateful.length - 1],
        cpu_usage_stateless: data.cpu_usage_stateless[data.cpu_usage_stateless.length - 1],
        memory_usage_stateful: data.memory_usage_stateful[data.memory_usage_stateful.length - 1],
        memory_usage_stateless: data.memory_usage_stateless[data.memory_usage_stateless.length - 1]
      }
    ]);
  }, [benchmarkingStopped]);

  const startBenchmark = useCallback(() => {
    setChartData({ labels: [], datasets: [] });
    setTableData([]);
    setBenchmarkingStopped(false);

    // Clear any existing intervals
    if (intervalId) {
      clearInterval(intervalId);
    }

    fetch('http://localhost:8005/start')
      .then((response) => response.text())
      .then((message) => {
        console.log(message);

        const newIntervalId = setInterval(updateChart, 1000); // Update the chart every second
        setIntervalId(newIntervalId);

        // Stop the interval after 60 seconds
        setTimeout(() => {
          clearInterval(newIntervalId);
          setBenchmarkingStopped(true);
          setIntervalId(null); // Reset interval ID
          console.log('Benchmarking stopped after 60 seconds.');
        }, 60000); // 60 seconds
      });
  }, [updateChart, intervalId]);

  const stopBenchmark = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setBenchmarkingStopped(true);
    console.log('Benchmarking manually stopped.');
  };

  const downloadTableData = () => {
    const csvContent = [
      ['Time Interval (s)', 'Latency (Stateful)', 'Latency (Stateless)', 'Throughput (Stateful)', 'Throughput (Stateless)', 'CPU Usage (Stateful)', 'CPU Usage (Stateless)', 'Memory Usage (Stateful)', 'Memory Usage (Stateless)'],
      ...tableData.map((row, index) => [
        index + 1,
        row.latency_stateful,
        row.latency_stateless,
        row.throughput_stateful,
        row.throughput_stateless,
        row.cpu_usage_stateful,
        row.cpu_usage_stateless,
        row.memory_usage_stateful,
        row.memory_usage_stateless
      ])
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'benchmark_data.csv';
    link.click();
  };

  useEffect(() => {
    startBenchmark();
  }, [startBenchmark]);

  return (
    <div className="container">
      <h1>Real-Time Benchmarking</h1>
      <button onClick={startBenchmark} className="start-button">Start Benchmark</button>
      <button onClick={stopBenchmark} className="stop-button">Stop Benchmark</button>
      <button onClick={downloadTableData} className="download-button">Download Table Data</button>

      <div className="chart-container">
        <div className="chart">
          <h2>Latency Comparison</h2>
          <Line data={{
            labels: chartData.labels,
            datasets: chartData.datasets.filter((dataset) =>
              dataset.label.includes('Latency')
            )
          }} options={{
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: 'Time (seconds)' }
              },
              y: {
                title: { display: true, text: 'Latency (ms)' },
                beginAtZero: true
              }
            }
          }} />
        </div>

        <div className="chart">
          <h2>Throughput Comparison</h2>
          <Line data={{
            labels: chartData.labels,
            datasets: chartData.datasets.filter((dataset) =>
              dataset.label.includes('Throughput')
            )
          }} options={{
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: 'Time (seconds)' }
              },
              y: {
                title: { display: true, text: 'Throughput (ops/sec)' },
                beginAtZero: true
              }
            }
          }} />
        </div>

        <div className="chart">
          <h2>CPU Usage Comparison</h2>
          <Line data={{
            labels: chartData.labels,
            datasets: chartData.datasets.filter((dataset) =>
              dataset.label.includes('CPU Usage')
            )
          }} options={{
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: 'Time (seconds)' }
              },
              y: {
                title: { display: true, text: 'CPU Usage (%)' },
                beginAtZero: true
              }
            }
          }} />
        </div>

        <div className="chart">
          <h2>Memory Usage Comparison</h2>
          <Line data={{
            labels: chartData.labels,
            datasets: chartData.datasets.filter((dataset) =>
              dataset.label.includes('Memory Usage')
            )
          }} options={{
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: 'Time (seconds)' }
              },
              y: {
                title: { display: true, text: 'Memory Usage (%)' },
                beginAtZero: true
              }
            }
          }} />
        </div>
      </div>

      <h2>Benchmark Data Table</h2>
      <table className="data-table">
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
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.latency_stateful}</td>
              <td>{row.latency_stateless}</td>
              <td>{row.throughput_stateful}</td>
              <td>{row.throughput_stateless}</td>
              <td>{row.cpu_usage_stateful}</td>
              <td>{row.cpu_usage_stateless}</td>
              <td>{row.memory_usage_stateful}</td>
              <td>{row.memory_usage_stateless}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BenchmarkingChart;
