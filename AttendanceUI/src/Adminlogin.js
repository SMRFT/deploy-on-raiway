import './Admin.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './Components/NavbarComp';
import profile from "./images/smrft(1).png";
import logo from "./images/smrft_logo.png";
import Footer from './Components/Footer';
import { lightGreen, red } from '@material-ui/core/colors';
import React, { useEffect } from "react";
import { Link, Routes, Route } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import ForgetPassword from '../src/Components/ForgetPassword';
function Adminlogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState("");
    const [name, setname] = useState("");
    const [mobile, setMobile] = useState("");
    const [role, setrole] = useState("");
    const [jwt, setjwt] = useState("");
    const navigate = useNavigate();
    const submit = async (e) => {
        e.preventDefault();
      
        // Check if email and password are not empty
        if (!email || !password) {
          setMessage("Email and password are required.");
          return;
        }
      
        const response = await fetch('http://127.0.0.1:7000/attendance/adminlog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' ,
        'Authorization':'Basic '+ btoa(email+':'+password)},
    
          credentials: 'include',
         
        });
      
        if (response.status === 200) {
          setMessage("Logged in successfully");
          const content = await response.json();
          const { email, name, mobile, role ,jwt} = content;
          // console.log("DDDD", content.jwt);
          localStorage.setItem('adminDetails', JSON.stringify({
            email,
            name,
            mobile,
            role,
            jwt: jwt // Here, you save the JWT token
        }));
          // Pass the admin details as props to the /Admin page
          navigate('/Admin/Viewemp', {
            state: {
              email,
              name,
              mobile,
              role
            }
          });
        } else {
          setMessage("Email or Password is incorrect");
        }
      };
    return (
        <body style={{ marginTop: "2%" }}>
        <div>
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
            <Nav.Link as={Link}  to="/" >
              <div className="nav_link1" style={{ color: "green", fontFamily: "cursive",marginTop:"5%" }}>Home</div></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
            <div className="screen-1">
                <img src={logo} className="logo1" alt="logo" />
                <form onSubmit={submit}>
                    <div style={{ font: "caption", fontStyle: "Times", fontFamily: "-moz-initial", fontSize: "40px", textAlign: "center" }}>Admin Login</div>
                    <br />
                    <div className='col-sm'>
                        <div className="row d-flex justify-content-center">
                            <input
                                type={"email"}
                                className="form-input centered-text"
                                placeholder='Email address'
                                required
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="new-email" 
                            />
                        </div>
                        <br />
                        <div className="row d-flex justify-content-center">
                            <input
                                type={"password"}
                                className="form-input centered-text" 
                                placeholder='Password'
                                required
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="new-password" 
                                />
                        </div>
                        <div style={{marginTop:"2%"}}>
                        <Link style={{marginLeft:"5%",marginTop:"15%"}} as={Link} to='/ForgetPassword'>Forget Password?</Link>
                        </div><br/>
                        <div className="col text-center">
                            <button className="button-78" role="button" type="submit">Sign in</button>                            
                            <div style={{ color: "red" }} className="message">{message ? <p>{message}</p> : null}</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div>
            <Footer />
        </div>
    </body>
);
}
export default Adminlogin;