import React from "react";
import "../styles/PacketCard.css";

function PacketCard({ packetName, status, latency, throughput }) {
  return (
    <div className="packet-card">
      <h3>{packetName}</h3>
      <p>Status: <strong>{status}</strong></p>
      <p>Latency: {latency} ms</p>
      <p>Throughput: {throughput} Mbps</p>
    </div>
  );
}

export default PacketCard;
