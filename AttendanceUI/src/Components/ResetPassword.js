import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import profile from "../images/smrft(1).png";
import "./ResetPassword.css"; 

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const updatePassword = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Make an API call to update the password
    try {
      const response = await axios.put("http://127.0.0.1:7000/attendance/reset-password/", {
        email,
        newPassword,
      });
      
      if (response.status === 200) {
        setMessage("Password updated successfully");
      } else {
        setMessage("Failed to update password");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while updating the password");
    }
  };

  return (
    <div style={{ marginTop: "-5%" }}>
      <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
      <div className='main'></div>
      <div className='logo'>
        <img src={profile} className="smrft_logo" alt="logo" />
      </div>
      <Navbar style={{ width: '50%', marginLeft: '15%', marginTop: '-6%' }}>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="mr-auto my-2 my-lg"
            style={{ marginLeft: '10%' }}
            navbarScroll>
            <Nav.Link as={Link} to="/adminlogin" >
              <div className="nav_link1" style={{ color: "green", fontFamily: "cursive", marginTop: "17%" }}>Admin Login</div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="reset-password-container">
        <h2>Reset Password</h2>
        <form className='reset-password-form' onSubmit={updatePassword}>
           <div>
            <label className="reset-password-label">Email:</label>
            <input
              className="reset-password-input"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="reset-password-label">New Password:</label>
            <input
              className="reset-password-input"
              type="password"
              placeholder="Enter your new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="reset-password-label">Confirm Password:</label>
            <input
              className="reset-password-input"
              type="password"
              placeholder="Confirm your new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className='reset-password-button' type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;