import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Configuration from "./pages/Configuration";
import TrafficSimulation from "./pages/TrafficSimulation";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import Reports from "./pages/Reports";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginRegister from "./pages/LoginRegister"; // Import the LoginRegister page
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Main content */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/traffic-simulation" element={<TrafficSimulation />} />
          <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/login-register" element={<LoginRegister />} /> {/* New route */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
