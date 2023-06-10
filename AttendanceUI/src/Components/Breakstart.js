import Webcam from "react-webcam";
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
//import { ReactDOM } from "react";
import "../WebcamCapture.css";
import Myconstants from "../Components/Myconstants";
import { Navigate, useNavigate } from "react-router-dom";
import "../Admin";
import profile from "../images/smrft.png";
import NavbarComp from "../Components/NavbarComp";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { render } from "react-dom";
import { propTypes } from "react-bootstrap/esm/Image";
import { FilterTiltShift } from "@material-ui/icons";
import AWS from 'aws-sdk';
import Footer from './Footer';

const WebcamCaptureLogin = () => {
    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [error, setError] = useState(null);
    const [employee, setEmployees] = useState([]);
    const [isShown, setIsShown] = useState(true);
    const [message, setMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [duration, setDuration] = useState(null);
    let [login, setLogin] = useState();
    const handleClick = (event) => {
        setIsShown((current) => !current);

    };

    AWS.config.update({
        region: 'us-west-2',
        accessKeyId: 'AKIA2N5OVS4KY4HBQX5U',
        secretAccessKey: '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',
      });

      const capture = React.useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        try {
            const dataUrl = await toDataURL(imageSrc);
            const fileData = dataURLtoFile(dataUrl, 'imageName.jpg');
        
            // Retrieve the list of objects in the S3 bucket
            const s3 = new AWS.S3();
            const listParams = {
              Bucket: 'smrft-facial-recognition', // Replace with your S3 bucket name
            };
        
            const listData = await s3.listObjectsV2(listParams).promise();
            const objectKeys = listData.Contents.map((object) => object.Key);
        
            // Initialize the AWS Rekognition client
            const rekognition = new AWS.Rekognition();
        
            // Compare the captured image with the images in the S3 bucket
            const compareFace = async (index) => {
              if (index >= objectKeys.length) {
                console.log('No matching face found in the S3 bucket.');
                return;
              }
        
              const compareFacesParams = {
                SourceImage: {
                  Bytes: new Uint8Array(await fileData.arrayBuffer()),
                },
                TargetImage: {
                  S3Object: {
                    Bucket: 'smrft-facial-recognition',
                    Name: objectKeys[index],
                  },
                },
                SimilarityThreshold: 90, // Set a suitable similarity threshold
              };
        
              const compareData = await rekognition.compareFaces(compareFacesParams).promise();
              const faceMatches = compareData.FaceMatches;
        
              if (faceMatches.length > 0) {
                // A match is found, retrieve the matched image
                const matchedImageKey = objectKeys[index];
                const s3ImageParams = {
                  Bucket: 'smrft-facial-recognition',
                  Key: matchedImageKey,
                };
        
                const s3ImageData = await s3.getObject(s3ImageParams).promise();
                const matchedImageBytes = s3ImageData.Body;
        
                // Construct the URL dynamically using the retrieved image key
                const imageUrl = `https://smrft-facial-recognition.s3.us-west-2.amazonaws.com/${matchedImageKey}`;
                console.log('matchedImageKey:', matchedImageKey);       
                const splitValues = matchedImageKey.split('_');
                const nameOfEmployee = splitValues[0]; 
                const empId = splitValues[1].split('.')[0]; 
                console.log('Name of Employee:', nameOfEmployee);
                console.log('Employee ID:', empId);
        
                try {
                  const response = await fetch("https://smrftadmin.onrender.com/attendance/showempById", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: empId }),
                  });
                  if (response.ok) {
                    const data = await response.json();
                        ////employee time format change
                        const Emplogin = fileData.lastModifiedDate;
                        let logintime = moment(Emplogin)
                        logintime = moment(logintime).format('YYYY-MM-DD hh:mm a')
                        let log = moment(Emplogin)
                        let login = log.format('hh:mm a')
                        setLogin(login)
                        let date = log.format('YYYY-MM-DD')
                        let month = moment(logintime).format('MM')
                        let iddate = empId + date

                        ////employee shift time
                        let shift;
                        if (login >= Myconstants.shift1time && login < Myconstants.shift2time) {
                            shift = (Myconstants.shift1)
                        }
                        else if (login >= Myconstants.shift3time && login < Myconstants.shift4time) {
                            shift = (Myconstants.shift2)
                        }
                        else { shift = Myconstants.shift3 }

                        let takentime = '0'
                        await fetch(
                            "https://smrftadmin.onrender.com/attendance/lunchhourslogin",
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id: empId,
                                    name: nameOfEmployee,
                                    lunchstart: logintime,
                                    lunchEnd: logintime,
                                    iddate: iddate,
                                    date: date,
                                    Breakhour: takentime
                                }),
                            })
                            .then((response) => {
                              if (response.ok) {
                                // Login successful message
                                setMessage(Myconstants.lunchlogout);
                              } else {
                                // Login unsuccessful message
                                setMessage(Myconstants.lunchalreadylogout);
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

    return (
        <React.Fragment>
            <div>
                <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
                <div className='main'></div>
                <div className='logo'>
                    <img src={profile} className="smrft_logo" alt="logo" />
                </div>
            </div>

            <Navbar style={{ width: '500px', marginLeft: '250px', marginTop: '-90px' }}>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="mr-auto my-2 my-lg"
                        style={{ marginLeft: '100px' }}
                        navbarScroll>
                        <Nav.Link as={Link} to="/" className='nav_link1'>Home</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="container">
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
            </div>

            <button className="In" onClick={() => { capture(); handleClick(); }}>
                <i class="bi bi-camera2"> Check In</i>
            </button>

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
                    {employee.id && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>ID: {employee.id}</p>}
                    {employee.name && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Name: {employee.name}</p>}
                    {employee.designation && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Designation: {employee.designation}</p>}
                    {login && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Logintime: {login}</p>}
                    <br />
                </div>
                <div className="message" style={{ marginLeft: "30px", marginTop: "10px" }}>{message ? <p>{message}</p> : null}</div>
                <div className="col-lg" style={{ marginLeft: "80px", marginTop: "10px" }}>
                    <button className="btn btn-outline-success" onClick={() => { refreshPage(); }} variant="danger" type="submit" block>
                        <i className="bi bi-check-circle"> Done</i>
                    </button>
                </div>
            </div>

            {/* <Footer /> */}
        </React.Fragment >
    );
};
export default WebcamCaptureLogin;