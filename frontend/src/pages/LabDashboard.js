import React, { useState, useRef, useEffect, useCallback } from "react";
import "../styles/LabDashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faWifi, faFilter, faChartBar, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

function LabDashboard() {
  // State for different icon categories
  const [trafficSources, setTrafficSources] = useState([]);
  const [capturePackets, setCapturePackets] = useState([]);
  const [packetFiltering, setPacketFiltering] = useState([]);
  const [processingAnalysis, setProcessingAnalysis] = useState([]);
  const [resultsOutput, setResultsOutput] = useState([]);

  // Reference for dragging state and canvas
  const canvasRef = useRef(null);
  const draggingRef = useRef(false);

  // UseCallback for clearCanvasAndRedraw to avoid recreating it on each render
  const clearCanvasAndRedraw = useCallback((canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx);
  }, []); // empty array ensures it only creates the function once

  // Draw grid on canvas
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

  // UseCallback for handleMouseMove to avoid recreating it on each render
  const handleMouseMove = useCallback((e, iconId, category, setCategory) => {
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

    // Update the position of the dragged icon in the specific category
    if (category === "trafficSources") {
      setTrafficSources((prevIcons) =>
        prevIcons.map((icon) =>
          icon.id === iconId ? { ...icon, position: newPos } : icon
        )
      );
    } else if (category === "capturePackets") {
      setCapturePackets((prevIcons) =>
        prevIcons.map((icon) =>
          icon.id === iconId ? { ...icon, position: newPos } : icon
        )
      );
    } else if (category === "packetFiltering") {
      setPacketFiltering((prevIcons) =>
        prevIcons.map((icon) =>
          icon.id === iconId ? { ...icon, position: newPos } : icon
        )
      );
    } else if (category === "processingAnalysis") {
      setProcessingAnalysis((prevIcons) =>
        prevIcons.map((icon) =>
          icon.id === iconId ? { ...icon, position: newPos } : icon
        )
      );
    } else if (category === "resultsOutput") {
      setResultsOutput((prevIcons) =>
        prevIcons.map((icon) =>
          icon.id === iconId ? { ...icon, position: newPos } : icon
        )
      );
    }

    clearCanvasAndRedraw(canvas);
  }, [clearCanvasAndRedraw]); // Include clearCanvasAndRedraw as a dependency

  // Handle mouse down (begin drag)
  const handleMouseDown = () => {
    draggingRef.current = true;
  };

  // Handle mouse up (end drag)
  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  // Resize canvas on window resize
  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 500;
      canvas.height = window.innerHeight - 10;
      clearCanvasAndRedraw(canvas);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [clearCanvasAndRedraw]); // Added clearCanvasAndRedraw to the dependency array

  // Add new icon to the specific category
  const addIcon = (categorySetter) => {
    const newId = Date.now();
    categorySetter((prevIcons) => [
      ...prevIcons,
      { id: newId, position: { x: window.innerWidth / 2 - 25, y: window.innerHeight / 2 - 25 } },
    ]);
  };

  // Render individual icon with different colors
  const renderIcon = (iconId, position, category, setCategory, icon, color) => (
    <div
      key={iconId}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "move",
        zIndex: 10,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => handleMouseMove(e, iconId, category, setCategory)}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <FontAwesomeIcon icon={icon} size="3x" style={{ color: color }} />
    </div>
  );

  // Sidebar click handlers to add icons
  const addTrafficSource = () => addIcon(setTrafficSources);
  const addCapturePacket = () => addIcon(setCapturePackets);
  const addPacketFiltering = () => addIcon(setPacketFiltering);
  const addProcessingAnalysis = () => addIcon(setProcessingAnalysis);
  const addResultsOutput = () => addIcon(setResultsOutput);

  // Handle global mousemove and mouseup
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]); // Added handleMouseMove to the dependency array

  return (
    <div className="LabDashboard">
      <Navbar />
      <Sidebar
        setTrafficSourceVisible={addTrafficSource}
        setCapturePacketsVisible={addCapturePacket}
        setPacketFilteringVisible={addPacketFiltering}
        setProcessingAnalysisVisible={addProcessingAnalysis}
        setResultsOutputVisible={addResultsOutput}
      />
      <div className="canvas-container" style={{ position: "relative" }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
        {trafficSources.map((source) =>
          renderIcon(source.id, source.position, "trafficSources", setTrafficSources, faWifi, "brown")
        )}
        {capturePackets.map((packet) =>
          renderIcon(packet.id, packet.position, "capturePackets", setCapturePackets, faExchangeAlt, "blue")
        )}
        {packetFiltering.map((filter) =>
          renderIcon(filter.id, filter.position, "packetFiltering", setPacketFiltering, faFilter, "green")
        )}
        {processingAnalysis.map((analysis) =>
          renderIcon(analysis.id, analysis.position, "processingAnalysis", setProcessingAnalysis, faCog, "grey")
        )}
        {resultsOutput.map((output) =>
          renderIcon(output.id, output.position, "resultsOutput", setResultsOutput, faChartBar, "orange")
        )}
      </div>
    </div>
  );
}

export default LabDashboard;