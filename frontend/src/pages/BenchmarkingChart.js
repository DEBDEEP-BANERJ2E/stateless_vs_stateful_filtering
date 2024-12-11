import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import BenchmarkingChartTable from '../components/BenchmarkingChartTable'; // Data Table component
import BenchmarkingChartCanvas from '../components/BenchmarkingChartCanvas'; // Chart component

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BenchmarkingChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState([]);
  const [benchmarkingStopped, setBenchmarkingStopped] = useState(false);
  const [benchmarkingResumed, setBenchmarkingResumed] = useState(false);  // Track resume state
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const fetchData = async () => {
    const response = await fetch('http://localhost:8005/data');
    const data = await response.json();
    return data;
  };

  const updateChartAndTable = useCallback(async () => {
    if (benchmarkingStopped) return; // Don't fetch if benchmarking is stopped

    const data = await fetchData();

    // Update chart data
    const updatedData = {
      labels: Array.from({ length: data.latency_stateful.length }, (_, i) => i),  // Start from 0
      datasets: [
        { label: 'Latency (Stateful)', data: data.latency_stateful, borderColor: 'blue', fill: false },
        { label: 'Latency (Stateless)', data: data.latency_stateless, borderColor: 'orange', fill: false },
        { label: 'Throughput (Stateful)', data: data.throughput_stateful, borderColor: 'green', fill: false },
        { label: 'Throughput (Stateless)', data: data.throughput_stateless, borderColor: 'red', fill: false },
        { label: 'CPU Usage (Stateful)', data: data.cpu_usage_stateful, borderColor: 'purple', fill: false },
        { label: 'CPU Usage (Stateless)', data: data.cpu_usage_stateless, borderColor: 'cyan', fill: false },
        { label: 'Memory Usage (Stateful)', data: data.memory_usage_stateful, borderColor: 'brown', fill: false },
        { label: 'Memory Usage (Stateless)', data: data.memory_usage_stateless, borderColor: 'pink', fill: false }
      ]
    };

    setChartData(updatedData);

    // Update table data
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
    setBenchmarkingResumed(false); // Reset resume state

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // First stop the previous benchmark if it was running, then start a new one
    fetch('http://localhost:8005/start')
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        intervalRef.current = setInterval(updateChartAndTable, 1000); // Update chart and table every second
      });

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setBenchmarkingStopped(true);
      console.log('Benchmarking stopped after 60 seconds.');
    }, 61000); // Stop after 60 seconds
  }, [updateChartAndTable]);

  const stopBenchmark = useCallback(() => {
    fetch('http://localhost:8005/stop')
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        setBenchmarkingStopped(true);
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
      });
  }, []);

  const resumeBenchmark = useCallback(() => {
    setBenchmarkingStopped(false);
    setBenchmarkingResumed(true);

    fetch('http://localhost:8005/start')
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        intervalRef.current = setInterval(updateChartAndTable, 1000); // Resume fetching data every second
      });
  }, [updateChartAndTable]);

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

  const downloadChartData = (chartType) => {
    const chartCanvas = document.getElementById(`${chartType}-chart`);
    if (chartCanvas) {
      const url = chartCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chartType}_chart.png`;
      link.click();
    } else {
      console.log(`Canvas for ${chartType} not found`);
    }
  };
  

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current); // Clean up interval on unmount
      clearTimeout(timeoutRef.current); // Clean up timeout on unmount
    };
  }, []);

  return (
    <div className="container">
      <h1>Real-Time Benchmarking</h1>
      <button onClick={startBenchmark} className="start-button" disabled={benchmarkingStopped && !benchmarkingResumed}>
        Start Benchmark
      </button>
      <button onClick={stopBenchmark} className="stop-button" disabled={benchmarkingStopped}>
        Stop Benchmark
      </button>
      <button onClick={resumeBenchmark} className="resume-button" disabled={!benchmarkingStopped || benchmarkingResumed}>
        Resume Benchmark
      </button>
      <button onClick={downloadTableData} className="download-button">Download Table Data</button>

      <div className="chart-container">
        <BenchmarkingChartCanvas
          title="Latency Comparison"
          data={chartData}
          filter="Latency"
          id="Latency-chart"
        />
        <button onClick={() => downloadChartData('Latency')}>Download Latency Chart</button>
        
        <BenchmarkingChartCanvas
          title="Throughput Comparison"
          data={chartData}
          filter="Throughput"
          id="Throughput-chart"
        />
        <button onClick={() => downloadChartData('Throughput')}>Download Throughput Chart</button>
        
        <BenchmarkingChartCanvas
          title="CPU Usage Comparison"
          data={chartData}
          filter="CPU Usage"
          id="CPU-Usage-chart"
        />
        <button onClick={() => downloadChartData('CPU-Usage')}>Download CPU Usage Chart</button>
        
        <BenchmarkingChartCanvas
          title="Memory Usage Comparison"
          data={chartData}
          filter="Memory Usage"
          id="Memory-Usage-chart"
        />
        <button onClick={() => downloadChartData('Memory-Usage')}>Download Memory Usage Chart</button>
      </div>

      <h2>Benchmark Data Table</h2>
      <BenchmarkingChartTable tableData={tableData} />
    </div>
  );
};

export default BenchmarkingChart;
