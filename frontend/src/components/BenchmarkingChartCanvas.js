import React from 'react';
import { Line } from 'react-chartjs-2';

const BenchmarkingChartCanvas = ({ title, data, filter, id }) => {
  return (
    <div className="chart">
      <h2>{title}</h2>
      <Line
        data={{
          labels: data.labels,
          datasets: data.datasets.filter((dataset) =>
            dataset.label.includes(filter)
          ),
        }}
        options={{
          responsive: true,
          scales: {
            x: {
              title: { display: true, text: 'Time (seconds)' },
            },
            y: {
              title: { display: true, text: filter + ' (%)' },
              beginAtZero: true,
            },
          },
        }}
        id={id} // Assign the id to the canvas element
      />
    </div>
  );
};

export default BenchmarkingChartCanvas;
