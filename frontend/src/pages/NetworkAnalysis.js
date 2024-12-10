import React from "react";
import MetricsGraph from "../components/MetricsGraph";
import PacketCard from "../components/PacketCard";
import "../styles/PerformanceDashboard.css";  // Import the CSS file

function NetworkAnalysis() {
  const dummyGraphData = [10, 20, 30, 40, 50];
  const dummyLabels = ["Jan", "Feb", "Mar", "Apr", "May"];
  const packetInfo = [
    { packetName: "Packet A", status: "Active", latency: 20, throughput: 50 },
    { packetName: "Packet B", status: "Inactive", latency: 30, throughput: 40 },
  ];

  return (
    <div>
      <h2>Network Performance Analysis</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {packetInfo.map((packet, index) => (
          <PacketCard key={index} {...packet} />
        ))}
      </div>
      <div className="metrics-graph-container">
        <MetricsGraph
          title="Network Metrics"
          data={dummyGraphData}
          labels={dummyLabels}
        />
      </div>
    </div>
  );
}

export default NetworkAnalysis;
