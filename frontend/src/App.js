import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
//import Home from "./pages/Home";
import Configuration from "./pages/Configuration";
import TrafficSimulation from "./pages/TrafficSimulation";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import Reports from "./pages/Reports";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginRegister from "./pages/LoginRegister"; // Import the LoginRegister page
import Input from "./pages/Input";
import LabDashboard from "./pages/LabDashboard";
import LandingPage from "./pages/LandingPage";
import "./App.css";

function App() {
  const location = useLocation(); // Get the current route

  // List of routes where we don't want the Header to show
  const hideHeaderRoutes = ["/landing", "/login-register"];

  return (
    <div className="App">
      {/* Conditionally render Header based on the route */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/traffic-simulation" element={<TrafficSimulation />} />
        <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/lab-dashboard" element={<LabDashboard />} />
        <Route path="/input" element={<Input />} />
        <Route path="/login-register" element={<LoginRegister />} /> {/* New route */}
      </Routes>
      
      <Footer />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
