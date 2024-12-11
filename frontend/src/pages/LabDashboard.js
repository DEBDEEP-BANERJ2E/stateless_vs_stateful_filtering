import React, { useState, useRef, useEffect, useCallback } from "react";
import "../styles/LabDashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

function LabDashboard() {
  const [trafficSourceVisible, setTrafficSourceVisible] = useState(false); // Visibility state
  const [trafficSourcePosition, setTrafficSourcePosition] = useState({
    x: window.innerWidth / 2 - 25, // Center horizontally
    y: window.innerHeight / 2 - 25, // Center vertically
  });
  const canvasRef = useRef(null);
  const draggingRef = useRef(false); // Track dragging state

  const clearCanvasAndRedraw = useCallback((canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawGrid(ctx); // Redraw grid
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!draggingRef.current) return;

    const canvas = canvasRef.current;
    const bounds = canvas.getBoundingClientRect();

    const newPos = {
      x: Math.min(
        Math.max(e.clientX - bounds.left - 25, 0),
        bounds.width - 50
      ),
      y: Math.min(
        Math.max(e.clientY - bounds.top - 25, 0),
        bounds.height - 50
      ),
    };

    setTrafficSourcePosition(newPos);
    clearCanvasAndRedraw(canvas); // Clear and redraw to remove shadow
  }, [clearCanvasAndRedraw]);

  const handleMouseDown = (e) => {
    draggingRef.current = true;
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  const drawGrid = (ctx, gridSize = 50) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

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

  const renderTrafficSourceIcon = () =>
    trafficSourceVisible && (
      <div
        style={{
          position: "absolute",
          left: `${trafficSourcePosition.x}px`,
          top: `${trafficSourcePosition.y}px`,
          cursor: "move",
          zIndex: 10, // Ensure it is above the canvas
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the icon
      >
        <FontAwesomeIcon icon={faExchangeAlt} size="3x" color="#007bff" />
      </div>
    );

  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 500;
      canvas.height = window.innerHeight - 10;
      clearCanvasAndRedraw(canvas); // Clear and redraw when resizing
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [clearCanvasAndRedraw]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    <div className="LabDashboard">
      <Navbar />
      <Sidebar setTrafficSourceVisible={setTrafficSourceVisible} />
      <div className="canvas-container" style={{ position: "relative" }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
        {renderTrafficSourceIcon()} {/* Render the draggable icon */}
      </div>
    </div>
  );
}

export default LabDashboard;
