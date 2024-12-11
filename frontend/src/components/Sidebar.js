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
  faEllipsisH,
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
} from "@fortawesome/free-solid-svg-icons";
import "../styles/sidebar.css";

const Sidebar = ({ setTrafficSourceVisible }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNodesDropdownOpen, setNodesDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNodesDropdown = () => {
    setNodesDropdownOpen(!isNodesDropdownOpen);
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
                      onClick={() => setTrafficSourceVisible(true)} // Set visibility to true on click
                    >
                      Traffic Source
                    </span>
                  }
                />
                <DropdownItem text={<span style={{ marginLeft: "2em" }}>Capture Packets</span>} />
                <DropdownItem text={<span style={{ marginLeft: "2em" }}>Packet Filtering</span>} />
                <DropdownItem text={<span style={{ marginLeft: "2em" }}>Processing Analysis</span>} />
                <DropdownItem text={<span style={{ marginLeft: "2em" }}>Results Output</span>} />
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
            <MenuItem icon={faEllipsisH} text="More actions" />
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
  <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-600 p-2 rounded text-gray-300">
    <span>{text}</span>
  </li>
);

export default Sidebar;
