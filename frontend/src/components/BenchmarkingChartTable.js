import React from 'react';

const BenchmarkingChartTable = ({ tableData }) => {
  return (
    <table className="data-table" style={{ marginLeft: '20px'}}>
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
  );
};

export default BenchmarkingChartTable;
