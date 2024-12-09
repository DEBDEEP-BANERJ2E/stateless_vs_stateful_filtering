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
  faMoon,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        <ul className="space-y-4" style={{ marginTop: "50px" }}> {/* Add margin-top for spacing */}
          <MenuItem icon={faPlus} text="Add an object" />
          <MenuItem icon={faServer} text="Nodes" />
          <Link to="/traffic-simulation"><MenuItem icon={faNetworkWired} text="Networks" /></Link>
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
          <MenuItem icon={faMoon} text="Dark Mode" />
          <MenuItem icon={faTimes} text="Close lab" />
          <MenuItem icon={faSignOutAlt} text="Logout" />
        </ul>
      )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 grid grid-cols-1 gap-4 p-4">
        {/* Main content */}
      </main>
    </div>
  );
};

const MenuItem = ({ icon, text }) => (
  <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
    <FontAwesomeIcon icon={icon} />
    <span>{text}</span>
  </li>
);

export default Sidebar;
