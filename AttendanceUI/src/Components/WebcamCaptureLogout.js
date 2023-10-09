import Webcam from "react-webcam";
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import "../WebcamCapture.css";
import Myconstants from "../Components/Myconstants";
import { useNavigate } from "react-router-dom";
import "../Admin";
import profile from "../images/smrft.png";
import NavbarComp from "../Components/NavbarComp";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { render } from "react-dom";
import { propTypes } from "react-bootstrap/esm/Image";
import { LocalGroceryStore } from "@material-ui/icons";
import Footer from './Footer';
import AWS from 'aws-sdk';

const WebcamCaptureLogout = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [error, setError] = useState(null);
  const [employee, setEmployees] = useState([]);
  const [isShown, setIsShown] = useState(true);
  const [message, setMessage] = useState("")
  let [logout, setLogout] = useState("")

  //Function for hide and show for employee details
  const handleClick = (event) => {
    setIsShown((current) => !current);
  };

  const adminDetails = localStorage.getItem('adminDetails');
  const { email, name, mobile, role, jwt } = JSON.parse(adminDetails);
  // console.log(jwt)
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
            //Formatting time,date,month for posting
            const Emplogout = fileData.lastModifiedDate;
            let logouttime = moment(Emplogout)
            logouttime = moment(logouttime).format('YYYY-MM-DD HH:mm')
            let log = moment(Emplogout)
            let logout = log.format('HH:mm')
            setLogout(logout)
            // let shifttime = '2023-01-12 05:00'
            // let overtimehours = logouttime - shifttime
            // console.log(overtimehours)
            let date = log.format('YYYY-MM-DD')
              let  shiftEndTime;
              let shiftName;
              let shift;

            // / /Determine the shift based on the login time
            if (logout >= Myconstants.shift1.start && logout < Myconstants.shift1.end) {
              shift = 1;
              shiftName = Myconstants.shift1Name;
              shiftEndTime = Myconstants.shift1.end;
            } else if (logout >= Myconstants.shift2.start && logout < Myconstants.shift2.end) {
              shift = 2;
              shiftName = Myconstants.shift2Name;
              shiftEndTime = Myconstants.shift2.end;
            } else {
              shift = 3;
              shiftName = Myconstants.shift3Name;
              shiftEndTime = Myconstants.shift3.end;
            }
            
            // Calculate the early logout time for the shift
            const logoutTime = moment().set({'hour': logout.split(':')[0], 'minute': logout.split(':')[1]});
            const shiftEndTimeDate = moment().set({'hour': shiftEndTime.split(':')[0], 'minute': shiftEndTime.split(':')[1]});
            
            const diffMs = shiftEndTimeDate.diff(logoutTime);
            const diffDuration = moment.duration(diffMs);
            
            const hours = diffDuration.hours().toString().padStart(2, '0');
            const minutes = diffDuration.minutes().toString().padStart(2, '0');
            const seconds = diffDuration.seconds().toString().padStart(2, '0');
            
            const earlyLogout = `${hours}:${minutes}:${seconds}`;
            console.log("earlyLogout", earlyLogout);             

            //Updating logout information of employee to db using the above data
            await fetch("http://127.0.0.1:7000/attendance/admincalendarlogout", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",'Authorization': `${jwt}`
              },
              body: JSON.stringify({
                id: empId,
                name: nameOfEmployee,
                end: logouttime,
                date: date,
                earlyLogout:earlyLogout
              }),
            })
            .then((response) => {
              if (response.ok) {
                //Logout successfull message from constant file
                  setMessage(Myconstants.Webcamlogout);
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

  //Function for done icon to reload window 
  //after getting logout information of an employee saved to db
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
  // console.log("employee details:" + JSON.stringify(employee));

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
      <button className="Out" onClick={() => { capture(); handleClick(); }}>
      <i className="bi bi-camera2"> Check Out</i>
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
          {logout && <p style={{ fontWeight: "bold" }}>Logouttime: {logout}</p>}
          <br/>
        </div>
        <div className="message" style={{ marginLeft: "0.5%", marginTop: "3%" }}>{message ? <p>{message}</p> : null}</div><br/>
      </div>
      {/* <Footer /> */}
    </React.Fragment>
  );
};
export default WebcamCaptureLogout;