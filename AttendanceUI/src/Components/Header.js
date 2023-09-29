import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import SlidingPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css'; // Remove Link import
import profile from "../images/smrft(1).png";
import "./Header.css";
// import Notification from "./Notification";
import SettingsPage from './SettingsPage';
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [showNotificationIndicator, setShowNotificationIndicator] = useState(true);

  const pendingDeletionCount = localStorage.getItem("pendingDeletionCount") || 0;
  const notLoggedOutMessage = localStorage.getItem("notLoggedOutNotification") || '';

  const handleNotificationClick = () => {
    setOpenPanel(true); 
    setShowNotificationIndicator(false);
  };

  const togglePanel = () => {
    setOpenPanel(!openPanel);
  };
  const handleLogout = () => {
    navigate('/Adminlogin'); // Navigate to the login page after logout
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const adminDetails = localStorage.getItem('adminDetails');
      if (adminDetails) {
        const { email, name, mobile, role, jwt } = JSON.parse(adminDetails);
        console.log("DDDD",jwt)
        try {
          const response = await axios.get('http://127.0.0.1:7000/attendance/UserDetails', {
            headers: {
              Authorization: jwt            },
            params: { email: email }
          });
          setUserData(response.data);
          setError(null);
        } catch (error) {
          setUserData(null);
          setError(error.response ? error.response.data : 'An error occurred');
        }
      }
    };

    fetchUserData();
  }, []);
  return (
    <div>
      <div className="header-wrapper">
        <div className="row">
          <div className="header-content">
            <div className="col-sm-3">
              <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
              <header>
                <div className='main'></div>
                <div className='logo'>
                  <img src={profile} className="smrft_logo" alt="logo" />
                </div>
              </header>
            </div>
            <div className="header-icons">
              <div className="col-sm-3 d-flex justify-content-end" style={{ marginTop: "1%" }}>
                <i style={{ fontSize: "150%" }} className="bi bi-gear"></i>
              </div>
              <div className="col-sm-3 d-flex justify-content-end" style={{ marginTop: "1%" }}>
                {showNotificationIndicator && (
                  <div className="notification-indicator"></div>
                )}
                <i onClick={handleNotificationClick} style={{ fontSize: "150%", cursor: "pointer" }} className="bi bi-bell"></i>
              </div>
              <div className="col-sm-3 d-flex justify-content-end" style={{ marginTop: "11% !important" }}>
                <div
                  className="profile-pic"
                  onClick={toggleExpanded}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ marginTop: "9px" }} // Add margin-top to adjust the position
                >
                  <i style={{ fontSize: "180%" }} className="bi bi-person-fill"></i>
                  {showTooltip && userData && (
                    <div className="profile-pic-tooltip">
                      <span className="profile-pic-tooltip-text">{userData.name}  {userData.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {expanded && (
              <div className="employee-details">
                <div className="action-bar">
                  <p className='action-name'>{userData.name}</p>
                  <button className="action-btn" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SlidingPanel
        type="right" 
        isOpen={openPanel} 
      >
        <div className="notification-sidebar">
          <div className="notification-header">
            <h5 style={{ marginBottom: "10px",marginLeft:"2%",fontFamily: "serif" }}>Notifications</h5>
            <button onClick={togglePanel} className="close-button">
              <i style={{ fontSize: "200%" }} className="bi bi-x"></i>
            </button>
          </div>
          <div className="notification-content">
            <p><Link to="/Admin/Deleteemp" style={{ textDecoration: 'none', color: 'inherit' }}>
              <i style={{textDecoration:"underline",fontSize:"12px"}}>click here</i>  {pendingDeletionCount} employees are waiting for deletion approval.
            </Link></p>
            <p><Link to="/Fileviewer/Chandra_105" style={{ textDecoration: 'none', color: 'inherit' }}>
              <i style={{textDecoration:"underline",fontSize:"12px"}}>click here</i>  {notLoggedOutMessage}
            </Link></p>
          </div>
        </div>
      </SlidingPanel>
    </div>
  );
}

export default Header;
