import React from "react";
import "../styles/TrafficSimulation.css";

const TrafficSimulation = () => {
  // Sample data for packets
  const packets = [
    {
      no: 1,
      time: "132.333381",
      source: "10.2.0.1",
      destination: "23.62.63.87",
      protocol: "HTTP",
      length: 151,
      info: "GET /ncsi.txt HTTP/1.1",
      details: "Hypertext Transfer Protocol",
    },
    {
      no: 2,
      time: "132.666784",
      source: "10.2.0.1",
      destination: "23.62.63.87",
      protocol: "TLSv1.2",
      length: 135,
      info: "Client Hello",
      details: "Secure Handshake Message",
    },
  ];

  // Total rows to display in the table
  const totalRows = 20;

  // Fill vacant rows if needed
  const rows = [...packets];
  while (rows.length < totalRows) {
    rows.push({});
  }

  return (
    <div className="network-analysis-container">
      <h1> Filter Bench Traffic Simulation </h1>
      <table className="network-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Time</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Protocol</th>
            <th>Length</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((packet, index) => (
            <tr key={index} className={`table-row ${!packet.no ? "empty-row" : ""}`}>
              <td>{packet.no || "--"}</td>
              <td>{packet.time || "--"}</td>
              <td>{packet.source || "--"}</td>
              <td>{packet.destination || "--"}</td>
              <td className={packet.protocol ? `protocol ${packet.protocol.toLowerCase()}` : ""}>
                {packet.protocol || "--"}
              </td>
              <td>{packet.length || "--"}</td>
              <td>{packet.info || "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrafficSimulation;
