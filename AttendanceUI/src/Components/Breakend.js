import Webcam from "react-webcam";
import React from "react";
import axios from 'axios';
import moment from "moment";
import { useState, useEffect } from "react";
//import { ReactDOM } from "react";
import "../WebcamCapture.css";
import Myconstants from "../Components/Myconstants";
import { useNavigate } from "react-router-dom";
import "../Admin";
import profile from "../images/smrft.png";
import NavbarComp from "../Components/NavbarComp";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { render } from "react-dom";
import Footer from './Footer';
import AWS from 'aws-sdk';
import { propTypes } from "react-bootstrap/esm/Image";
import { LocalGroceryStore } from "@material-ui/icons";

const WebcamCaptureLogout = () => {
    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [error, setError] = useState(null);
    const [employee, setEmployees] = useState([]);
    const [isShown, setIsShown] = useState(true);
    const [message, setMessage] = useState("")
    let [logout, setLogout] = useState("")
    const [breakhours, setBreakhours] = useState([]);
    const handleClick = (event) => {
        setIsShown((current) => !current);
    };

    const adminDetails = localStorage.getItem('adminDetails');
    const { email, name, mobile, role, jwt } = JSON.parse(adminDetails);
    console.log(jwt)
      const capture = React.useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        try {
          const dataUrl = await toDataURL(imageSrc);
          const fileData = dataURLtoFile(dataUrl, 'imageName.jpg');
      
          // Compare the captured image with the images on the server using the API endpoint
          const formData = new FormData();
          formData.append('image', fileData);
        
            // Retrieve the list of objects in the S3 bucket
            const response = await fetch('http://127.0.0.1:7000/attendance/facial-recognition/', {
              method: 'POST',
              body: formData
            });
        
            if (response.ok) {
              const result = await response.json();
              if (result.recognized) {
                const recognizedName = result.name;
                console.log('Recognized Name:', recognizedName);
                setEmployees(recognizedName);
                const splitValues = recognizedName.split('_');
                const nameOfEmployee = splitValues[0];
                const empId = splitValues[1].split('.')[0];
                console.log('Name of Employee:', nameOfEmployee);
                console.log('Employee ID:', empId);
        
   
                try {
                  const response = await fetch("http://127.0.0.1:7000/attendance/showempById", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", 'Authorization': `${jwt}` },
                    body: JSON.stringify({ id: empId }),
                  });
        
                  if (response.ok) {
                    const data = await response.json();
                        ////employee time format change
                        const Emplogout = fileData.lastModifiedDate;
                        let logouttime = moment(Emplogout)
                        let time = moment(logouttime).format(' hh:mm a')
                        logouttime = moment(logouttime).format('YYYY-MM-DD hh:mm a')
                        let log = moment(Emplogout)
                        let logout = log.format('HH:mm')
                        setLogout(time)
                        let date = log.format('YYYY-MM-DD')

                        await fetch("http://127.0.0.1:7000/attendance/lunchhourslogout", {
                            method: "Post",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                id: empId,
                                name: nameOfEmployee,
                                lunchEnd: logouttime,
                                date: date
                            }),
                        })
                        .then((response) => {
                            if (response.ok) {
                                setMessage(Myconstants.lunchlogin);
                                    return fetch("http://127.0.0.1:7000/attendance/breakhours", {
                                        method: "Post",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            id: empId,
                                            date: date
                                        }),
                                    })
                                        .then((response) => response.json())
                                        .then((data) => {
                                            setBreakhours(data);
                                            console.log(data)
                                        })
                                        .catch((error) => {
                                            console.error("Error fetching breakhours data: ", error);
                                        });
                                } else {
                                    setMessage(Myconstants.Webcamnotlogin);
                                }
                            })
                            setEmployees(data);
                        } else {
                          console.log("Error: Failed to retrieve employee details.");
                        }
                      } catch (error) {
                        console.log("Error:", error);
                      }
                    } else {
                      // No match found, compare with the next image
                      compareFace(index + 1);
                    }
                  };
                  await compareFace(0);
                } catch (error) {
                  console.error("Error:", error);
                }
              }, [webcamRef, setImgSrc]);

    function refreshPage() {
        {
            window.location.reload();
        }
    }

    //converting "image source" (url) to "Base64"
    const toDataURL = (url) =>
        fetch(url)
            .then((response) => response.blob())
            .then(
                (blob) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    })
            );
    //converting "Base64" to javascript "File Object"
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename);
    }
    // useEffect(() => {
    //   const timeout = setTimeout(() => {
    //     window.location.reload();
    //   }, 20000);
    //   return () => clearTimeout(timeout);
    // }, []);
    return (
        <React.Fragment>
        <div>
          <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
          <div className='main'></div>
          <div className='logo'>
            <img src={profile} className="smrft_logo" alt="logo" />
          </div>
        </div>
  
        <Navbar style={{ width: '50%', marginLeft: '20%', marginTop: '-7%' }}>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="mr-auto my-2 my-lg"
            style={{ marginLeft: '15%'}}
            navbarScroll>
            <Nav.Link as={Link}  to="/Break" >
              <div className="nav_link1" style={{ color: "cadetblue", fontFamily: "cursive", ':hover': { background: "blue" } }}>Break</div></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  
        <div className="container">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <button className="In" onClick={() => { capture(); handleClick(); }}>
          <i className="bi bi-camera2"> Check In</i>
        </button>
        </div>
  
        {imgSrc && (
          <img
            className="screenshot"
            src={imgSrc}
            alt="capture"
          />
        )}

            <div className="empdetails" style={{ display: isShown ? "none" : "block" }}>
                <div>
                    <br />
                    {employee.id && <p style={{ fontWeight: "bold" }}>ID: {employee.id}</p>}
                    {employee.name && <p style={{ fontWeight: "bold" }}>Name: {employee.name}</p>}
                    {employee.designation && <p style={{ fontWeight: "bold"}}>Designation: {employee.designation}</p>}
                    <div>
                        {breakhours.map(item => (
                            <div key={item.id}>
                                <p style={{ fontWeight: "bold" }}>
                                    logout time: {moment(item.lunchstart).format("hh:mm a")}
                                </p>
                                <p style={{ fontWeight: "bold"}}>Breakhour: {item.Breakhour}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="message" style={{ marginLeft: "0.5%", marginTop: "3%" }}>{message ? <p>{message}</p> : null}</div><br/>
                </div>
            {/* <Footer /> */}
        </React.Fragment >
    );
};
export default WebcamCaptureLogout;