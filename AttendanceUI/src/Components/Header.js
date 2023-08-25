import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import profile from "../images/smrft(1).png";
import "./Header.css"
const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [role, setRole] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const handleLogout = () => {
      navigate('/Adminlogin'); // Navigate to login page after logout
    }
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
          const { email, name, mobile, role } = JSON.parse(adminDetails);
          setEmail(email);
          setName(name);
          setMobile(mobile);
          setRole(role);
          try {
            const response = await axios.get('http://127.0.0.1:7000/attendance/UserDetails', {
              params: { email: email } // Set the desired email as a query parameter
            });
            setUserData(response.data);
            setError(null);
          } catch (error) {
            setUserData(null);
            setError(error.response.data);
          }
        }
      };
      fetchUserData();
    }, []);
    return(
    <div className="header-wrapper" style={{backgroundColor:"#F9FAFC"}}>
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
  <div className="col-sm-3 d-flex justify-content-end"
  style={{marginTop:"1%"}}>
    <i style={{fontSize:"150%"}} className="bi bi-gear"></i>
  </div>
  <div className="col-sm-3 d-flex justify-content-end"
  style={{marginTop:"1%"}}>
    <i style={{fontSize:"150%"}} className="bi bi-bell"></i>
  </div>
    <div className="col-sm-3 d-flex justify-content-end"
    style={{marginTop:"1%"}}>
    <div
      className="profile-pic"
      onClick={toggleExpanded}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <i style={{fontSize:"180%"}} className="bi bi-person-fill"></i>
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
        {userData && (
          <>
            <h2 className="employee-name">{userData.name}</h2>
            <div className="employee-details-expanded">
              <p className="employee-title">{userData.email}</p>
              <p className="employee-title">{userData.role}</p>
            </div>
          </>
        )}
        <div className="action-bar">
          <button className="action-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    )}
  </div>
  </div>
    </div>
    )
}
export default Header;