import React, { useState } from "react";
import axios from "axios";
import { Link, Routes, Route } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import profile from "../images/smrft(1).png";
import "./ForgetPassword.css"

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendResetCode = async (e) => {
    e.preventDefault();

        // Make an API call to your backend to send the reset code
        try {
            const response = await axios.post("http://127.0.0.1:7000/attendance/send-reset-code/", { email }); 
            if (response.status === 200) {
              setMessage("Reset code sent successfully");
            } else {
              setMessage("Failed to send reset code");
            }
          } catch (error) {
            console.error(error);
            setMessage("An error occurred while sending the reset code");
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
        style={{ marginLeft: '10%'}}
        navbarScroll>
        <Nav.Link as={Link}  to="/adminlogin" >
        <div className="nav_link1" style={{ color: "green", fontFamily: "cursive",marginTop:"17%" }}>Admin Login</div></Nav.Link>
    </Nav>
    </Navbar.Collapse>
    </Navbar>

    <div className="forget-password-container">
      <h2>Forget Password</h2>
      <form className='forget-password-form' onSubmit={sendResetCode}>
        <div>
          <label className="forget-password-label">Email:</label>
          <input
            className="forget-password-input"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className='forget-password-button' type="submit">Send Reset Code</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
}

export default ForgetPassword;