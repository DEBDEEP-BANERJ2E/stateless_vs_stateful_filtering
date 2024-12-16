import React from 'react';

const BenchmarkingChartTable = ({ tableData }) => {
  const getArrow = (current, previous) => {
    if (current > previous) {
      return <span style={{ color: 'green', fontSize: '2em', fontWeight: 'bold', marginLeft: '5px' }}>↑</span>; // Green upward arrow, thicker
    } else if (current < previous) {
      return <span style={{ color: 'red', fontSize: '2em', fontWeight: 'bold', marginLeft: '5px' }}>↓</span>; // Red downward arrow, thicker
    } else {
      return null; // No arrow for equal values
    }
  };
  

  return (
    <table className="data-table" style={{ marginLeft: '20px' }}>
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
            <td>
              {row.latency_stateful}
              {index > 0 && getArrow(row.latency_stateful, tableData[index - 1].latency_stateful)}
            </td>
            <td>
              {row.latency_stateless}
              {index > 0 && getArrow(row.latency_stateless, tableData[index - 1].latency_stateless)}
            </td>
            <td>
              {row.throughput_stateful}
              {index > 0 && getArrow(row.throughput_stateful, tableData[index - 1].throughput_stateful)}
            </td>
            <td>
              {row.throughput_stateless}
              {index > 0 && getArrow(row.throughput_stateless, tableData[index - 1].throughput_stateless)}
            </td>
            <td>
              {row.cpu_usage_stateful}
              {index > 0 && getArrow(row.cpu_usage_stateful, tableData[index - 1].cpu_usage_stateful)}
            </td>
            <td>
              {row.cpu_usage_stateless}
              {index > 0 && getArrow(row.cpu_usage_stateless, tableData[index - 1].cpu_usage_stateless)}
            </td>
            <td>
              {row.memory_usage_stateful}
              {index > 0 && getArrow(row.memory_usage_stateful, tableData[index - 1].memory_usage_stateful)}
            </td>
            <td>
              {row.memory_usage_stateless}
              {index > 0 && getArrow(row.memory_usage_stateless, tableData[index - 1].memory_usage_stateless)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BenchmarkingChartTable;
