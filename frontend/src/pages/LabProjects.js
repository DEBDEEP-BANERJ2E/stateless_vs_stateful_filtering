import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LabProjects.css';

const LabProjects = () => {
  return (
    <div className="lab-projects">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Lab Manager</h1>
        <ul>
          <li><Link to="/lab-projects">Examples</Link></li>
          <li><Link to="/lab-projects">Recent</Link></li>
          <li><Link to="/lab-projects">FilterBench Cloud</Link></li>
          <li><Link to="/lab-projects">GitHub</Link></li>
          <li><Link to="/lab-projects">Upload</Link></li>
          <br></br>
          <button className="new-notebook"><Link to="/lab-dashboard">+ New Lab</Link></button>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content">
      <h1 style={{ marginLeft: '20%' }}>FilterBench-Lab Projects</h1>

        <div className="search-bar">
          <input type="text" placeholder="Search Lab Projects" />
          <button title="Search">
            <i className="fas fa-search"></i>
          </button>
          <button title="Clear Search">
            <i className="fas fa-trash"></i>
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Last Opened</th>
              <th>First Opened</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src="https://placehold.co/20x20" alt="Colab icon" /> Welcome To FilterBench
              </td>
              <td>7:28 AM</td>
              <td>Sep 16, 2023</td>
            </tr>
            <tr>
              <td>
              <Link to="/lab-dashboard">
                <img src="https://placehold.co/20x20" alt="Google Drive icon" />
                <div style={{ display: 'inline-block', color: 'black' }}>Lab 1</div>
              </Link>

              </td>
              <td>November 26</td>
              <td>November 23</td>
            </tr>
            <tr>
              <td>
                <img src="https://placehold.co/20x20" alt="Google Drive icon" /> Lab 2
              </td>
              <td>November 19</td>
              <td>November 17</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabProjects;
