import React, { useRef, useEffect } from "react";
import "../styles/LabDashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function LabDashboard() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawGrid = (gridSize = 50) => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 0.5;

      for (let x = gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 500; // Adjust for sidebar width
      canvas.height = window.innerHeight - 10; // Adjust for navbar height
      drawGrid();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div className="LabDashboard">
      <Navbar />
      <Sidebar />
      <canvas ref={canvasRef} />
    </div>
  );
}

export default LabDashboard;
