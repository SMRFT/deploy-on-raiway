import Webcam from "react-webcam";
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import "../WebcamCapture.css";
import Myconstants from "../Components/Myconstants";
import "../Admin";
import profile from "../images/smrft.png";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import AWS from 'aws-sdk';
import Footer from './Footer';

const WebcamCaptureLogin = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [employee, setEmployees] = useState([]);
  const [isShown, setIsShown] = useState(true);
  const [message, setMessage] = useState("");
  const [Email, setEmail] = useState("");
  let [login, setLogin] = useState();
  const [EmployeeName, setEmployeeName] = useState("");

  //Function for hide and show for employee details
  const handleClick = (event) => {
    setIsShown((current) => !current);
  };

  const adminDetails = localStorage.getItem('adminDetails');
  const { email, name, mobile, role, jwt } = JSON.parse(adminDetails);
  const capture = React.useCallback(async () => {
    // Function to get the camera screenshot image of an employee and change it to data URL
    const imageSrc = webcamRef.current.getScreenshot();
  
    // Convert the captured image to data URL
    setImgSrc(imageSrc);
  
    try {
      const dataUrl = await toDataURL(imageSrc);
      const fileData = dataURLtoFile(dataUrl, 'imageName.jpg');
  
      // Compare the captured image with the images on the server using the API endpoint
      const formData = new FormData();
      formData.append('image', fileData);
  
      const response = await fetch('http://127.0.0.1:7000/attendance/facial-recognition/', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.recognized) {
          const recognizedName = result.name;
          // console.log('Recognized Name:', recognizedName);
          setEmployeeName(recognizedName);
          const splitValues = recognizedName.split('_');
          const nameOfEmployee = splitValues[0];
          const empId = splitValues[1].split('.')[0];
          // console.log('Name of Employee:', nameOfEmployee);
          // console.log('Employee ID:', empId);
  
          try {
            const response = await fetch("http://127.0.0.1:7000/attendance/showempById", {
              method: "POST",
              headers: { "Content-Type": "application/json", 'Authorization': `${jwt}` },
              body: JSON.stringify({ id: empId }),
            });
  
            if (response.ok) {
              const data = await response.json();
              //Formatting time, date, month for posting
              const empLogin = fileData.lastModifiedDate;
              const logintime = moment(empLogin).format('YYYY-MM-DD HH:mm');
              setLogin(logintime)
              const year = moment(logintime).format('YYYY');
              const date = moment(logintime).format('YYYY-MM-DD');
              const day = moment(logintime).format('DD');
              const month = moment(logintime).format('MM');
              const iddate = empId + date;
              const leavetype = "none";
              let shift;
              let shiftName;
              let shiftStartTime;
  
              // Determine the shift based on the login time
              if (moment(logintime).isBetween(Myconstants.shift1.start, Myconstants.shift1.end, null, '[)')) {
                shift = 1;
                shiftName = Myconstants.shift1Name;
                shiftStartTime = Myconstants.shift1.start;
              } else if (moment(logintime).isBetween(Myconstants.shift2.start, Myconstants.shift2.end, null, '[)')) {
                shift = 2;
                shiftName = Myconstants.shift2Name;
                shiftStartTime = Myconstants.shift2.start;
              } else {
                shift = 3;
                shiftName = Myconstants.shift3Name;
                shiftStartTime = Myconstants.shift3.start;
              }
  
              // Calculate the late login time for the shift
              const loginTime = moment(logintime, 'YYYY-MM-DD HH:mm');
              const shiftStartTimeDate = moment(shiftStartTime, 'HH:mm');
  
              const diffDuration = moment.duration(loginTime.diff(shiftStartTimeDate));
              const lateLogin = diffDuration.asSeconds() > 0 ? diffDuration.toISOString().substr(11, 8) : '00:00:00';
              const earlyLogout = "00:00:00";
  
              const attendanceData = {
                id: empId,
                name: nameOfEmployee,
                start: logintime,
                end: logintime,
                date: date,
                shift: shiftName,
                iddate: iddate,
                month: month,
                year: year,
                day: day,
                latelogin: lateLogin,
                earlyLogout: earlyLogout,
                leavetype: leavetype
              };
  
              await fetch("http://127.0.0.1:7000/attendance/admincalendarlogin", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",'Authorization': `${jwt}`
                },
                body: JSON.stringify(attendanceData),
              })
                .then((response) => {
                  if (response.ok) {
                    // Login successful message
                    setMessage(Myconstants.Webcamlogin);
                  } else {
                    // Login unsuccessful message
                    setMessage(Myconstants.Webcamalreadylogin);
                  }
                });
  
              // Employee shift time
              const cc = 'parthipanmurugan335317@gmail.com';
              const subject = "Shanmuga Hospital Login Details";
              const message = `Name: ${nameOfEmployee},
                Employee id:${empId},
                Date: ${date},
                Shift Login time: ${logintime}`;
  
              const email = data.email;
              setEmail(email);
  
              await fetch("http://127.0.0.1:7000/attendance/send-email/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({ subject, message, recipient: email, cc_recipients: cc }),
              });
  
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
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [webcamRef, setImgSrc, setEmployeeName, setLogin, setEmployees, setMessage, setEmail]);
  
  
  //Function for done icon to reload window 
  //after getting login information of an employee saved to db
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
  function dataURLtoFile(dataURL, filename) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  
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
            <Nav.Link as={Link}  to="/" >
              <div className="nav_link1" style={{ color: "cadetblue", fontFamily: "cursive", ':hover': { background: "blue" } }}>Home</div></Nav.Link>
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
    <br/>
    {employee.id && <p style={{ fontWeight: "bold"}}>ID: {employee.id}</p>}
    {employee.name && <p style={{ fontWeight: "bold"}}>Name: {employee.name}</p>}
    {employee.designation && <p style={{ fontWeight: "bold"}}>Designation: {employee.designation}</p>}
    {login && <p style={{ fontWeight: "bold" }}>Logintime: {login}</p>}
    <br/>
  </div>
  <div className="message" style={{ marginLeft: "0.5%", marginTop: "3%" }}>
    {message ? <p>{message}</p> : null}
  </div>
  <br/>
</div>

      {/* <Footer /> */}
    </React.Fragment >
  );
};

export default WebcamCaptureLogin;