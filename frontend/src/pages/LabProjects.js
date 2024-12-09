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
          <li><Link to="/lab-projects" className="active">Recent</Link></li>
          <li><Link to="/lab-projects">Google Drive</Link></li>
          <li><Link to="/lab-projects">GitHub</Link></li>
          <li><Link to="/lab-projects">Upload</Link></li>
        </ul>
        <button className="new-notebook">+ New Lab</button>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="search-bar">
          <input type="text" placeholder="Search notebooks" />
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
                <img src="https://placehold.co/20x20" alt="Colab icon" /> Welcome To Colab
              </td>
              <td>7:28 AM</td>
              <td>Sep 16, 2023</td>
            </tr>
            <tr>
              <td>
                <img src="https://placehold.co/20x20" alt="Google Drive icon" /> Copy of Welcome To Colab
              </td>
              <td>November 26</td>
              <td>November 23</td>
            </tr>
            <tr>
              <td>
                <img src="https://placehold.co/20x20" alt="Google Drive icon" /> Untitled5.ipynb
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
