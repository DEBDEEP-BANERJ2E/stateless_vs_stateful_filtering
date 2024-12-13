import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faPlus,
  faServer,
  faNetworkWired,
  faCogs,
  faObjectGroup,
  faSyncAlt,
  faSearch,
  faInfoCircle,
  faInfo,
  faLock,
  faExchangeAlt,
  faTimes,
  faSignOutAlt,
  faChevronDown,
  faChevronUp,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/sidebar.css";

const Sidebar = ({ 
  setTrafficSourceVisible, 
  setCapturePacketsVisible, 
  setPacketFilteringVisible, 
  setProcessingAnalysisVisible, 
  setResultsOutputVisible,
  setPenMode,
  setEraserMode
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNodesDropdownOpen, setNodesDropdownOpen] = useState(false);
  const [isToolboxDropdownOpen, setToolboxDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNodesDropdown = () => {
    setNodesDropdownOpen(!isNodesDropdownOpen);
  };

  const toggleToolboxDropdown = () => {
    setToolboxDropdownOpen(!isToolboxDropdownOpen);
  };

  const handlePenClick = () => {
    setPenMode(true);
    setEraserMode(false); // Ensure Eraser mode is turned off when Pen is activated
  };

  const handleEraserClick = () => {
    setEraserMode(true);
    setPenMode(false); // Ensure Pen mode is turned off when Eraser is activated
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`sidebar ${
          isSidebarOpen ? "w-64" : "w-12"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Toggle Button */}
        <button
          className={`toggle-btn text-white p-2 rounded absolute top-2 ${
            isSidebarOpen ? "left-60" : "left-2"
          }`}
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="faBars-btn" />
        </button>

        {/* Menu Items */}
        {isSidebarOpen && (
          <ul className="space-y-4" style={{ marginTop: "50px" }}>
            <MenuItem icon={faPlus} text="Add an object" />

            {/* Nodes Dropdown */}
            <li
              className="flex items-center justify-between cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={toggleNodesDropdown}
            >
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faServer} />
                <span>Nodes</span>
              </div>
              <FontAwesomeIcon icon={isNodesDropdownOpen ? faChevronUp : faChevronDown} />
            </li>
            {isNodesDropdownOpen && (
              <ul className="pl-8 space-y-2">
                <DropdownItem
                  text={
                    <span
                      style={{ marginLeft: "2em" }}
                      onClick={() => setTrafficSourceVisible()}
                    >
                      Traffic Source
                    </span>
                  }
                />
                <DropdownItem
                  text={
                    <span
                      style={{ marginLeft: "2em" }}
                      onClick={() => setCapturePacketsVisible()}
                    >
                      Capture Packets
                    </span>
                  }
                />
                <DropdownItem
                  text={
                    <span
                      style={{ marginLeft: "2em" }}
                      onClick={() => setPacketFilteringVisible()}
                    >
                      Packet Filtering
                    </span>
                  }
                />
                <DropdownItem
                  text={
                    <span
                      style={{ marginLeft: "2em" }}
                      onClick={() => setProcessingAnalysisVisible()}
                    >
                      Processing Analysis
                    </span>
                  }
                />
                <DropdownItem
                  text={
                    <span
                      style={{ marginLeft: "2em" }}
                      onClick={() => setResultsOutputVisible()}
                    >
                      Results Output
                    </span>
                  }
                />
              </ul>
            )}

            {/* Toolbox Dropdown */}
            <li
              className="flex items-center justify-between cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={toggleToolboxDropdown}
            >
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faToolbox} />
                <span>Toolbox</span>
              </div>
              <FontAwesomeIcon icon={isToolboxDropdownOpen ? faChevronUp : faChevronDown} />
            </li>
            {isToolboxDropdownOpen && (
              <ul className="pl-8 space-y-2">
                <DropdownItem
                  text={
                    <span
                      style={{ marginLeft: "2em" }}
                      onClick={handlePenClick}
                    >
                      Pen
                    </span>
                  }
                />
                <DropdownItem
                  text={
                    <span
                      style={{ marginLeft: "2em" }}
                      onClick={handleEraserClick}
                    >
                      Eraser
                    </span>
                  }
                />
              </ul>
            )}

            <Link to="/traffic-simulation">
              <MenuItem icon={faExchangeAlt} text="Traffic Simulation" />
            </Link>
            <Link to="/network">
              <MenuItem icon={faNetworkWired} text="Networks" />
            </Link>
            <MenuItem icon={faCogs} text="Startup-configs" />
            <MenuItem icon={faObjectGroup} text="Configured objects" />
            <MenuItem icon={faSyncAlt} text="Refresh topology" />
            <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
              <FontAwesomeIcon icon={faSearch} />
              <span>Zoom</span>
              <input
                type="range"
                className="ml-2 w-full h-2 rounded bg-gray-700"
              />
            </li>
            <MenuItem icon={faInfoCircle} text="Status" />
            <MenuItem icon={faInfo} text="Lab details" />
            <MenuItem icon={faLock} text="Lock Lab" />
            <MenuItem icon={faTimes} text="Close lab" />
            <MenuItem icon={faSignOutAlt} text="Logout" />
          </ul>
        )}
      </aside>
    </div>
  );
};

const MenuItem = ({ icon, text }) => (
  <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
    <FontAwesomeIcon icon={icon} />
    <span>{text}</span>
  </li>
);

const DropdownItem = ({ text }) => (
  <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
    {text}
  </li>
);

export default Sidebar;
