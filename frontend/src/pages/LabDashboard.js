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
  
  // State for input visibility and value for each icon
  const [activeInput, setActiveInput] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // Reference for dragging state and canvas
  const canvasRef = useRef(null);
  const draggingRef = useRef(false);

  const clearCanvasAndRedraw = useCallback((canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx);
  }, []); 

  const drawGrid = (ctx, gridSize = 20) => { // Reduced the grid size from 50 to 20
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.strokeStyle = "#ccc"; // Light gray color for grid
    ctx.lineWidth = 0.5; // Fine line width for grid

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
  }, [clearCanvasAndRedraw]); 

  const handleMouseDown = () => {
    draggingRef.current = true;
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleInputSubmit = (e, iconId, category, setCategory) => {
    if (e.key === "Enter") {
      // Update the category array with the new input value
      if (category === "trafficSources") {
        setTrafficSources((prevIcons) =>
          prevIcons.map((icon) =>
            icon.id === iconId ? { ...icon, data: inputValue } : icon
          )
        );
      } else if (category === "capturePackets") {
        setCapturePackets((prevIcons) =>
          prevIcons.map((icon) =>
            icon.id === iconId ? { ...icon, data: inputValue } : icon
          )
        );
      } else if (category === "packetFiltering") {
        setPacketFiltering((prevIcons) =>
          prevIcons.map((icon) =>
            icon.id === iconId ? { ...icon, data: inputValue } : icon
          )
        );
      } else if (category === "processingAnalysis") {
        setProcessingAnalysis((prevIcons) =>
          prevIcons.map((icon) =>
            icon.id === iconId ? { ...icon, data: inputValue } : icon
          )
        );
      } else if (category === "resultsOutput") {
        setResultsOutput((prevIcons) =>
          prevIcons.map((icon) =>
            icon.id === iconId ? { ...icon, data: inputValue } : icon
          )
        );
      }
      setActiveInput(null); // Hide the input after submission
      setInputValue(""); // Clear the input field
    }
  };

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
      onClick={() => {
        setActiveInput(iconId); // Show input for this icon
      }}
    >
      <FontAwesomeIcon icon={icon} size="3x" style={{ color: color }} />
      {activeInput === iconId && (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => handleInputSubmit(e, iconId, category, setCategory)}
          style={{
            position: "absolute",
            top: "-30px", // Position above the icon
            left: "0",
            backgroundColor: "yellow",
            border: "1px solid black",
            padding: "5px",
            width: "100px",
          }}
        />
      )}
    </div>
  );

  const addIcon = (categorySetter) => {
    const newId = Date.now();
    categorySetter((prevIcons) => [
      ...prevIcons,
      { id: newId, position: { x: window.innerWidth / 2 - 25, y: window.innerHeight / 2 - 25 } },
    ]);
  };

  const addTrafficSource = () => addIcon(setTrafficSources);
  const addCapturePacket = () => addIcon(setCapturePackets);
  const addPacketFiltering = () => addIcon(setPacketFiltering);
  const addProcessingAnalysis = () => addIcon(setProcessingAnalysis);
  const addResultsOutput = () => addIcon(setResultsOutput);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  // Set canvas size on load
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clearCanvasAndRedraw(canvas);
  }, [clearCanvasAndRedraw]);

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
