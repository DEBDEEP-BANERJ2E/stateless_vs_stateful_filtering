import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
//import Home from "./pages/Home";
import NetworkAnalysis from "./pages/NetworkAnalysis";
import TrafficSimulation from "./pages/TrafficSimulation";
import Reports from "./pages/Reports";
import Reports1 from "./pages/Reports1";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginRegister from "./pages/LoginRegister"; // Import the LoginRegister page
import Input from "./pages/Input";
//import Home from "./pages/Home";
import LabDashboard from "./pages/LabDashboard";
import LandingPage from "./pages/LandingPage";
import LabProjects from "./pages/LabProjects";
import BenchmarkingChart from "./pages/BenchmarkingChart";
import RandomForest from "./pages/RandomForest";
import "./App.css";

function App() {
  const location = useLocation(); // Get the current route

  // List of routes where we don't want the Header to show
  const hideHeaderRoutes = ["/landing", "/login-register", "/home"];

  return (
    <div className="App">
      {/* Conditionally render Header based on the route */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/network" element={<NetworkAnalysis />} />
        <Route path="/traffic-simulation" element={<TrafficSimulation />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports1" element={<Reports1 />} />
        <Route path="/lab-dashboard" element={<LabDashboard />} />
        <Route path="/lab-projects" element={<LabProjects />} />
        <Route path="/benchmarking" element={<BenchmarkingChart />} />
        <Route path="/random-forest" element={<RandomForest />} />
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
