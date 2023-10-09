import { useState } from 'react';
import axios from 'axios';
import React, { useEffect, useCallback } from "react";
import { Navbar, Nav } from 'react-bootstrap';
import Viewemp from './Viewemp';
import Addemp from './Addemp';
import Dashboard from './Dashboard';
import Summary from './Summary';
import EmployeeHours from './EmployeeHours';
import AdminReg from '../Adminreg';
import Deleteemp from './Deleteemp';
import profile from "../images/smrft(1).png";
import './NavbarComp.css';
import { useNavigate } from "react-router-dom";
import "./Fileviewer.css";
import { CSVLink } from 'react-csv';
import "./NavbarComp.css";
import Footer from './Footer';
import Header from './Header';
import Layout from './Layout';
import EditForm from "./EditForm";
import DatePicker from "react-datepicker";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import moment from 'moment';
import Card from 'react-bootstrap/Card';

function DownloadButton(props) {
    // Set up state variables
    const [isLoading, setIsLoading] = useState(false);
    const [activeIcon, setActiveIcon] = useState("");
    const [isIframeVisible, setIsIframeVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [Userempdata, setUserempdata] = useState([]);
    const [selectedMonthYear, setSelectedMonthYear] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [day, setDay] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [selectedId, setSelectedId] = useState("");
    const [users, setUsers] = useState([]);
    // const options = users.map(user => ({value: user.id, label: user.name}));

    // Get the name parameter from the URL
    const params = useParams();
    const name = params.name;
    const sub = name.split('_');
    const id = sub[1]
    const name1 = sub[0]

    // Close the iframe
    const closeIframe = () => {
        setIsIframeVisible(false);
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.remove();
        }
      };

        // Function to close the previously clicked icon's content
        const closePreviousContent = () => {
            if (activeIcon !== "proof" && activeIcon !== "certificates") {
            if (activeIcon === "summary") {
                toggleSummaryPicker(); // close summary content
            } else if (activeIcon === "attendance") {
                toggleAttendancePicker(); // close attendance content
            } else if (activeIcon === "overtime") {
                toggleOvertimePicker(); // close overtime content
            } else if (activeIcon === "table") {
                toggleTables(); // close Table content
            } else if (activeIcon === "payroll") {
              togglePayrollPicker(); // close Table content
            } else if (activeIcon === "EmployeeHours") {
              toggleEmployeeHoursPicker();
          }
            }
        };
         // Click event handler for the proof icon
         const handleProofIconClick = () => {
            setShowTables(false)
            setShowAttendanceTable(false);
            setShowOvertimeTable(false);
            setShowTable(false);
            setShowPayrollTable(false);
            setShowEmployeeHoursTable(false);
            closePreviousContent(); // close previous content
            setActiveIcon("proof"); // set active icon
            viewFile1(); 
            closeIframe(); 
            };

        // Click event handler for the certificates icon
        const handleCertificatesIconClick = () => {
            setShowTables(false);
            setShowAttendanceTable(false);
            setShowOvertimeTable(false);
            setShowTable(false);
            setShowEmployeeHoursTable(false);
            setShowPayrollTable(false);
            closePreviousContent(); 
            setActiveIcon("certificates"); 
            viewFile(); 
            closeIframe(); 
            };
  
        // Click event handler for the summary icon
        const handleSummaryIconClick = () => {
            setShowTables(false);
            setShowAttendanceTable(false);
            setShowOvertimeTable(false);
            setShowPayrollTable(false);
            setShowEmployeeHoursTable(false);
            closePreviousContent(); 
            setActiveIcon("summary"); 
            toggleSummaryPicker(); 
            closeIframe(); 
        };

        // Click event handler for the attendance icon
        const handleAttendanceIconClick = () => {
            setShowTables(false);
            setShowOvertimeTable(false);
            setShowTable(false);
            setShowPayrollTable(false);
            setShowEmployeeHoursTable(false);
            closePreviousContent();
            setActiveIcon("attendance"); 
            toggleAttendancePicker(); 
            closeIframe(); 
        };

        // Click event handler for the overtime icon
        const handleOvertimeIconClick = () => {
            setShowTables(false);
            setShowPayrollTable(false);
            setShowAttendanceTable(false);
            setShowTable(false);
            setShowEmployeeHoursTable(false);
            closePreviousContent(); 
            setActiveIcon("overtime"); 
            toggleOvertimePicker(); 
            closeIframe(); 
        };

        // Click event handler for the payroll icon
        const handlePayrollIconClick = () => {
              setShowTables(false);
              setShowAttendanceTable(false);
              setShowOvertimeTable(false);
              setShowTable(false);
              setShowEmployeeHoursTable(false);
              closePreviousContent(); 
              setActiveIcon("payroll"); 
              togglePayrollPicker(); 
              closeIframe(); 
          };

        // Click event handler for the EmployeeHours icon
          const handleEmployeeHoursIconClick = () => {
                setShowAttendanceTable(false);
                setShowTables(false);
                setShowOvertimeTable(false);
                setShowTable(false);
                setShowPayrollTable(false);
                closePreviousContent(); // close previous content
                setActiveIcon("EmployeeHours"); // set active icon
                toggleEmployeeHoursPicker(); 
                closeIframe(); 
            };

        // Click event handler for the employee details icon
        const handleTableIconClick = () => {
            setShowAttendanceTable(false);
            setShowOvertimeTable(false);
            setShowTable(false);
            setShowPayrollTable(false);
            setShowEmployeeHoursTable(false);
            closePreviousContent(); // close previous content
            setActiveIcon("table"); // set active icon
            toggleTables(); 
            closeIframe(); // close the iframe
            };

    // Click event handler for the editform icon
    const handleEditIconClick = () => {
      setShowAttendanceTable(false);
      setShowOvertimeTable(false);
      setShowTable(false);
      setShowTables(false);
      setShowPayrollTable(false);
      setShowEmployeeHoursTable(false);
      closePreviousContent();
      setActiveIcon("edit");
      
      if (showEditForm) {
        window.location.reload();
      } else {
        setShowEditForm(!showEditForm);
        closeIframe();
      }
    };
    

      //View the file in an iframe when the View button is clicked
      const viewFile1 = () => {
        setIsLoading(true);
        setShowTables(false);
        setShowAttendanceTable(false);
        setShowOvertimeTable(false);
        setShowTable(false);
        setShowPayrollTable(false);
        setShowEmployeeHoursTable(false);
        const queryParams = new URLSearchParams();

        // Make a POST request to the server to get the file as a blob
        axios
          .post(
            `http://127.0.0.1:7000/attendance/get_file?filename=${name}_proof.pdf`,
            {
              filename: `${name}_proof.pdf`,
            },
            {
              responseType: "blob",
            }
          )
          .then((response) => {
            // Remove the previously created iframe, if it exists
            const oldIframe = document.querySelector("iframe");
            if (oldIframe) {
              oldIframe.remove();
            }
            // Create a new iframe and set its source to the blob URL
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            const iframe = document.createElement("iframe");
            iframe.src = fileURL;
            iframe.style.width = "50%";
            iframe.style.marginLeft = "30%"
            iframe.style.marginTop = "6%"
            iframe.style.height = `${window.innerHeight}px`;
            document.body.appendChild(iframe);
            setIsLoading(false);
            setIsIframeVisible(true);
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
            setMessage(
              error.response && error.response.status === 404
                ? "File not found."
                : "An error occurred while retrieving the file."
            );
          });
      };
      // View the file in an iframe when the View button is clicked
      const viewFile = () => {
      setIsLoading(true);
      setShowAttendanceTable(false);
      setShowOvertimeTable(false);
      setShowTable(false);
      setShowPayrollTable(false);
      setShowEmployeeHoursTable(false);
      const queryParams = new URLSearchParams();

      // Make a POST request to the server to get the file as a blob
      axios.post(`http://127.0.0.1:7000/attendance/get_file?filename=${name}_certificates.pdf`, {
          filename: `${name}_certificate.pdf`,
      }, {
          responseType: "blob"
      })
          .then(response => {
              // Remove the previously created iframe, if it exists
              const oldIframe = document.querySelector('iframe');
              if (oldIframe) {
                  oldIframe.remove();
              }
              // Create a new iframe and set its source to the blob URL
              const file = new Blob([response.data], { type: 'application/pdf' });
              const fileURL = URL.createObjectURL(file);
              const iframe = document.createElement('iframe');
              iframe.src = fileURL;
              iframe.style.width = "50%";
              iframe.style.marginLeft = "30%"
              iframe.style.marginTop = "6%"
              iframe.style.height = `${window.innerHeight}px`;
              document.body.appendChild(iframe);
              setIsLoading(false);
              setIsIframeVisible(true);
          })
          .catch((error) => {
              console.error(error);
              setIsLoading(false);
              setMessage(
                  error.response && error.response.status === 404
                      ? "File not found."
                      : "An error occurred while retrieving the file."
              );
          });
      };
      
    const [educationData, setEducationData] = useState([]);
    const [experienceData, setExperienceData] = useState(null);
    const [referenceData, setReferenceData] = useState(null);
    const [showTables, setShowTables] = useState(false);

    const toggleTables = () => {
        setShowTables(!showTables);
        closeIframe(); // or closeIframe1()
    };

    const [employee, setEmployee] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const navigate = useNavigate();
    //Navigate to Calendar
    const navigateToCalendar = () => {
        navigate(`/AdminCalendar/${employee.name + '_' + employee.id}`)
        closeIframe();
    };
    const adminDetails = localStorage.getItem('adminDetails');
    const { jwt } = JSON.parse(adminDetails);
    useEffect(() => {
        const apiUrl = `http://127.0.0.1:7000/attendance/showemp?id=${id}`;
        const headers = {
            'Authorization': `${jwt}`
        };
    
        fetch(apiUrl, {
            method: 'GET',
            headers: headers
        })
        .then((res) => res.json())
        .then(
            (data) => {
                setEmployee(data);
                setEducationData(JSON.parse(data.educationData));
                setExperienceData(JSON.parse(data.experienceData));
                setReferenceData(JSON.parse(data.referenceData));
            },
            (error) => {
                console.error(error);
            }
        );
    }, [id, jwt]);
    


    
  const generatePDF = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:7000/attendance/generate-pdf/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Create a blob from the response data
        const blob = await response.blob();
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a link and trigger a click to download the file
        const a = document.createElement('a');
        a.href = url;
        a.download = `${employee.name + '_' + employee.id}.pdf`;
        a.click();
        // Release the URL object
        window.URL.revokeObjectURL(url);
      } else {
        console.error('PDF generation failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
    
    const [showSummaryPicker, setShowSummaryPicker] = useState(false);
    const [showAttendancePicker, setShowAttendancePicker] = useState(false);
    const [showOvertimePicker, setShowOvertimePicker] = useState(false);
    const [showPayrollPicker, setShowPayrollPicker] = useState(false);
    const[showEmpolyeeHours,setShowEmpolyeeHourspicker]= useState(false);
    const [userdata, setUserdata] = useState([]);
    const [myMonth, setMyMonth] = useState(new Date());
    const [myYear, setMyYear] = useState(new Date());
    const [myDay, setMyDay] = useState(new Date());
    const newDate = new Date();
    const minDate = new Date(myYear.getFullYear(), myMonth.getMonth(), 1);
    const maxDate = new Date(myYear.getFullYear(), myMonth.getMonth() + 1, 0);
    const [showTable, setShowTable] = useState(false);
    const [showAttendanceTable, setShowAttendanceTable] = useState(false);
    const [showOvertimeTable, setShowOvertimeTable] = useState(false);
    const [showPayrollTable, setShowPayrollTable] = useState(false);
    const [showEmployeeHoursTable, setShowEmployeeHoursTable] = useState(false);
    
    const toggleSummaryPicker = () => {
        setShowSummaryPicker(!showSummaryPicker);
        setShowTables(false);
        setShowAttendanceTable(false);
        setShowOvertimeTable(false);
        setShowPayrollTable(false);
        setShowEmployeeHoursTable(false);
        closeIframe();
      };

      const toggleAttendancePicker = () => {
        setShowAttendancePicker(!showAttendancePicker);
        setShowTables(false);
        setShowOvertimeTable(false);
        setShowTable(false);
        setShowPayrollTable(false);
        setShowEmployeeHoursTable(false);
        closeIframe();
      };

      const toggleOvertimePicker = () => {
        setShowOvertimePicker(!showOvertimePicker);
        setShowTables(false);
        setShowAttendanceTable(false);
        setShowTable(false);
        setShowPayrollTable(false);
        setShowEmployeeHoursTable(false);
        closeIframe();
      };

      const togglePayrollPicker = () => {
        setShowPayrollPicker(!showPayrollPicker);
        setShowTables(false);
        setShowOvertimeTable(false);
        setShowAttendanceTable(false);
        setShowEmployeeHoursTable(false);
        setShowTable(false);
        closeIframe();
      };

      const toggleEmployeeHoursPicker = () => {
        setShowEmpolyeeHourspicker(!showEmpolyeeHours);
        setShowTables(false);
        setShowAttendanceTable(false);
        setShowOvertimeTable(false);
        setShowPayrollTable(false);
        setShowTable(false);
        closeIframe();
      };

      const handleSummaryClick = () => {
        setShowTable(!showTable);
        setShowTables(false);
        setShowAttendanceTable(false);
        setShowOvertimeTable(false);
        setShowPayrollTable(false);
        setShowEmployeeHoursTable(false);
        closeIframe();
      };    

      const handleOvertimeClick = () => {
        setShowOvertimeTable(!showOvertimeTable);
        setShowTables(false);
        setShowAttendanceTable(false);
        setShowTable(false);
        setShowPayrollTable(false);
        setShowEmployeeHoursTable(false);
        closeIframe();
      };   

      const handleAttendanceClick = () => {
        setShowAttendanceTable(!showAttendanceTable);
        setShowTables(false);
        setShowOvertimeTable(false);
        setShowPayrollTable(false);
        setShowTable(false);
        setShowEmployeeHoursTable(false);
        closeIframe();
      }; 

      const handlePayrollClick = () => {
        setShowPayrollTable(!showPayrollTable);
        setShowTables(false);
        setShowOvertimeTable(false);
        setShowAttendanceTable(false);
        setShowTable(false);
        setShowEmployeeHoursTable(false);
        closeIframe();
      }; 

      const handleEmployeeHoursClick = () => {
        setShowEmployeeHoursTable(!showEmployeeHoursTable);
        setShowTables(false);
        setShowTable(false);
        setShowAttendanceTable(false);
        setShowOvertimeTable(false);
        setShowPayrollTable(false);
        closeIframe();
      };
  
    useEffect(() => {
        const getuserdata = async () => {
          fetch("http://127.0.0.1:7000/attendance/EmployeeExport", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: id,
              month: myDay.getMonth() + 1,
              year: myDay.getFullYear(),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              setUserdata(data);
            });
        };
        getuserdata();
      }, [myDay]);
    useEffect(() => {
        setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
    }, [myMonth, myYear, setMyDay]);
    const renderDayContents = (day, date) => {
        if (date < minDate || date > maxDate) {
            return <span></span>;
        }
        return <span>{date.getDate()}</span>;
    };

    const [userexportdata, setExportdata] = useState([]);
    useEffect(() => {
        const getexportdata = async () => {
          fetch("http://127.0.0.1:7000/attendance/EmployeeSummaryExport", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              month: myDay.getMonth() + 1,
              year: myDay.getFullYear(),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              setExportdata(data);
              console.log(userexportdata)
            });
        };
        getexportdata();
      }, [myDay]);
    useEffect(() => {
        setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
    }, [myMonth, myYear, setMyDay]);
    const renderExportContents = (day, date) => {
        if (date < minDate || date > maxDate) {
            return <span></span>;
        }
        return <span>{date.getDate()}</span>;
    };


const [error, setError] = useState(null);
const [isLoaded, setIsLoaded] = useState(false);
let [ state, setState] = useState("");
state = {
    activeLink: '',
  };
  const handleNavItemClick = (linkName) => {
    setState({ activeLink: linkName });
  };


 
  useEffect(() => {
    fetch("http://127.0.0.1:7000/attendance/showemp", {
      method: "GET",
      headers: {
        "Authorization": ` ${jwt}`
      }
    })
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setUsers({ blogs: data });
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const handleEmpIdChange = (selectedOption) => {
    setSelectedId(selectedOption);
  };
  const handleMonthYearChange = (date) => {
    setSelectedMonthYear(date);
    if (date) {
      setMonth(date.getMonth() + 1);
      setYear(date.getFullYear());
    }
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setDay(date.getDate());
      setMonth(date.getMonth() + 1);
      setYear(date.getFullYear());
    } else {
      setDay(null);
      setMonth(null);
      setYear(null);
    }
  };
  useEffect(() => {
    const getuserdata = async () => {
      fetch("http://127.0.0.1:7000/attendance/Employeehours", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: day,
          month: month,
          year: year,
          id: id
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserempdata(data);
        });
    };
    getuserdata();
  }, [day, month, year, selectedId]);

    return (
        <React.Fragment>
          <Header/>
          <body style={{marginTop:"7%",marginLeft:"15%"}}>
        <div className="wrapper">
        <div className="sidenav" style={{height: '100%',width: '14%',position: 'fixed',zIndex: 1,top: 80,left: 0,backgroundColor: 'rgb(103, 180, 204)',
        transition: '.5s ease',overflowX: 'hidden',paddingTop: '1%',display: 'flex',flexDirection: 'column',alignItems: 'center',
        }}>
            <div className="sidebar-wrapper">
              <div className="sidebar-menu">
                <ul className="sidebar-nav">
                  <div className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/" className={`home ${state.activeLink === 'home' ? 'active' : ''}`}
                      onClick={() => {handleNavItemClick('home');closeIframe();}}
                    >Home</Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/Viewemp" className={`employeedetails ${state.activeLink === 'employeedetails' ? 'active' : ''}`}
                      onClick={() => {handleNavItemClick('employeedetails');closeIframe();}}
                    >Employee</Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/Addemp" className={`addemployee ${state.activeLink === 'addemployee' ? 'active' : ''}`}
                      onClick={() => {handleNavItemClick('addemployee');closeIframe();}}
                    >Add Employee</Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/Dashboard" className={`dashboard ${state.activeLink === 'dashboard' ? 'active' : ''}`}
                      onClick={() => {handleNavItemClick('dashboard');closeIframe();}}
                    > Dashboard</Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/Deleteemp" className={`Deleteemp ${state.activeLink === 'Deleteemp' ? 'active' : ''}`}
                      onClick={() => {handleNavItemClick('Deleteemp');closeIframe();}}
                    >Pending Approvals</Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/AdminReg" className={`AdminReg ${state.activeLink === 'AdminReg' ? 'active' : ''}`}
                    onClick={() => {handleNavItemClick('AdminReg');closeIframe();}}
                    >Admin</Nav.Link>
                  </div>
                </ul>
                </div>
            </div>
        </div>
            <main>
            <Routes>
                <Route exact path='/Viewemp' element={<Viewemp />} ></Route>
                <Route exact path='/Addemp' element={<Addemp />} ></Route>
                <Route exact path='/Dashboard' element={<Dashboard />} ></Route>
                <Route exact path='/Summary' element={<Summary />} ></Route>
                <Route exact path='/EmployeeHours' element={<EmployeeHours/>} ></Route>   
                <Route exact path='/Deleteemp' element={<Deleteemp/>} ></Route>
                <Route exact path='/AdminReg' element={<AdminReg/>} ></Route>
            </Routes>
            </main>
        </div>
        <Card md={2} className="files"><br/>
        <Card.Body style={{ display: 'flex', flexDirection: 'column'}}>
        <img
          src={`http://127.0.0.1:7000/attendance/get_file?filename=${name1 + '_' + id + '_' + 'profile' + '.jpg'}`}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '20%',
            marginTop:'-16%',
            marginLeft: '-6%'
          }}
          alt="Profile Picture"
        />
       {employee && (
        <div >
          <div style={{ color: "#525E75", fontWeight: "bold", fontFamily: "serif", fontSize: "17px", marginLeft:"38%",marginTop:"-38%",whiteSpace:'nowrap' }}>
            {employee.name}
          </div>
          <div style={{ color: "#525E75", fontFamily: "serif", fontSize: "16px", marginLeft:"38%",whiteSpace:'nowrap'}}>
            {employee.department}
          </div>
          <div style={{ color: "#525E75", fontFamily: "serif", fontSize: "16px", marginLeft:"38%",whiteSpace:'nowrap'}}>
            Salary: {employee.salary}
          </div>
        </div>
        )}
  <div className="button-container4">
      <button onClick={generatePDF} title="Employee details ">
        <i className="fas fa-download"></i>
      </button>
    </div>
        </Card.Body>
             </Card>  <br/>    

            <div className="icon-container">
                <a onClick={() =>{handleTableIconClick();closeIframe();}} className="view-link" style={{ marginLeft:"2%",marginTop:"-0.5%",cursor: "pointer"}} >
                <i style={{fontFamily:"serif",fontSize:"40px",color:"darkolivegreen"}} className="bi bi-person-lines-fill"></i>
                {showTables ? "" : ""} 
                </a>
                <div style={{fontFamily:"serif",fontSize:"14px",color: 'black',marginLeft: '-60px',marginTop:"50px",whiteSpace:"nowrap"}}>Employee Details</div>
                <div className="divider"></div>
                <i onClick={() => {handleEditIconClick();setEditMode(!editMode)}} className="bi bi-pencil-square" style={{fontSize:"35px",color:"darkslategrey",marginTop:"-0.3%",cursor:"pointer"}}></i>
                <div style={{fontFamily:"serif",fontSize:"14px",color: 'black',marginLeft: '-45px',marginTop:"50px",whiteSpace:"nowrap"}}>Edit Details</div> 
                <div className="divider"></div>
                <a onClick={handleProofIconClick} className="view-link" style={{marginLeft:"-1%", marginTop:"-0.3%",cursor: "pointer"}} disabled={isLoading}>
                   {isLoading && activeIcon === "proof" ? <i style={{fontSize:"30px",fontWeight:"bold"}} className="fas fa-spinner fa-pulse"></i> : <i style={{fontSize:"35px",color:"darkred"}} className="bi bi-filetype-pdf"></i>}
                </a>
                <div style={{fontFamily:"serif",fontSize:"14px",color: 'black',marginLeft: '-35px',marginTop:"50px"}}>Proof</div>
                <div className="divider"></div>
                <a onClick={handleCertificatesIconClick} className="view-link" disabled={isLoading} style={{marginLeft: '4px', marginTop:"-0.3%",cursor: "pointer" }}>
                    {isLoading && activeIcon === "certificates" ? <i style={{fontSize:"30px",fontWeight:"bold"}} className="fas fa-spinner fa-pulse"></i> : <i style={{fontSize:"35px",color:"darkred"}} className="bi bi-filetype-pdf"></i>}
                </a>
                <div style={{fontFamily:"serif",fontSize:"16px",color: 'black',marginLeft: '-48px',marginTop:"50px"}}>Certificates</div>  
                <div className="divider"></div>
                <i  onClick={() => {navigateToCalendar(employee);closeIframe();}} style={{fontSize:"35px",color:"darkblue",marginTop:"-0.3%",cursor:"pointer"}} className="bi bi-calendar-week"></i>
                <div style={{fontFamily:"serif",fontSize:"16px",color: 'black',marginLeft: '-45px',marginTop:"50px"}}>Calendar</div>
                <div className="divider"></div>
                <i onClick={() => {handleSummaryIconClick();closeIframe();}} className="bi bi-journal-text" style={{fontSize:"35px",color:"darkmagenta",marginTop:"-0.3%",cursor:"pointer"}}></i>
                <div style={{fontFamily:"serif",fontSize:"16px",color: 'black',marginLeft: '-45px',marginTop:"50px"}}>Summary</div> 
                <div className="divider"></div>
                <i onClick={() => {handleAttendanceIconClick();closeIframe();}} style={{fontSize:"45px",color:"darkslategrey",marginTop:"-1%",marginLeft: '5px',cursor:"pointer"}} className="bi bi-person-check-fill"></i>
                <div style={{fontFamily:"serif",fontSize:"16px",color: 'black',marginLeft: '-60px',marginTop:"50px"}}>Attendance</div>
                <div className="divider"></div>
                <i onClick={() => {handleOvertimeIconClick();closeIframe();}} style={{fontSize:"35px",color:"darkslateblue",marginLeft: '2px',marginTop:"-0.3%",cursor:"pointer"}} className="bi bi-calendar-plus"></i>
                <div style={{fontFamily:"serif",fontSize:"16px",color: 'black',marginLeft: '-45px',marginTop:"50px",whiteSpace:"nowrap"}}>Over Time</div>
                <div className="divider"></div>
               <i onClick={() => {handleEmployeeHoursIconClick();closeIframe();}} className="far fa-clock fa-2x" style={{fontsize:"45px",color:"darkslateblue",marginTop:"0.5%",cursor:"pointer"}}></i>
               <div style={{fontFamily:"serif",fontSize:"16px",color: 'black',marginLeft: '-45px',marginTop:"50px",whiteSpace:"nowrap"}}>Late & Early</div>
                <div className="divider"></div>
                <i onClick={() => {handlePayrollIconClick();closeIframe();}} style={{fontSize:"35px",color:"darkslateblue",marginTop:"0.2%",marginLeft: '-0.5%',cursor:"pointer"}} className="fa fa-dollar"></i>
                <div style={{fontFamily:"serif",fontSize:"16px",color: 'black',marginLeft: '-25px',marginTop:"50px",whiteSpace:"nowrap"}}>Pay roll</div>
                {/* <div className="divider">
           
      <button onClick={generatePDF} style={{fontSize:"15px",color:"darkslateblue",marginTop:"0.10%",marginLeft: '-0.5%',cursor:"pointer"}}title="Employee details ">
        <i className="fas fa-download"></i>
      </button>
    </div> */}
            </div>

            <div style={{marginLeft:'40%',marginTop:"4%",color:'red',whiteSpace:"nowrap"}} className="message">
                    {message ? <p>{message}</p> : null}
            </div>

            {showEditForm && employee && ( // Show EditForm component if showEditForm is true
               <div style={{marginLeft:"-10%",marginTop:"4%"}}>
            <div style={{fontSize:"26px",color:"darkcyan",whiteSpace:"nowrap",marginLeft:"50%",fontFamily:"serif"}}>Edit Form</div><br/>
            <EditForm theuser={employee} toggleForm={handleEditIconClick} /></div>
            )}    

                {showSummaryPicker && (
                 <div className='summary-container'>
                <div style={{fontFamily:"serif",fontSize:"25px",color:"darkcyan",whiteSpace:"nowrap"}}>Summary Report</div><br/>
                 <DatePicker
                   selected={myDay}
                   onChange={(date) => setMyDay(date)}
                   dateFormat='MM/yyyy'
                   showMonthYearPicker
                 /><br/>
                 <div style={{marginLeft:'5%',marginTop:"10%"}}>
                   <button style={{backgroundColor:"powderblue",fontWeight:"bold",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}} 
                   onClick={handleSummaryClick}>View</button>
                 </div>
                 <div style={{marginLeft:'55%',marginTop:"-24%"}}>
                    <button title="Download CSV" style={{backgroundColor:"powderblue",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}}>
                    <CSVLink style={{fontSize:'30px',color:"white",fontWeight:"bold",textAlign:"center"}} className="bi bi-download" data={userdata} filename={name1}></CSVLink></button>
                    </div>
               </div>
                )}
                {showTable && (
                <div className='summary-table-container'>
                    <table className="table table-hover">
                    <thead style={{fontSize:"15px"}} >
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Month</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Shift</th>
                        <th>Worked Hours</th>
                        <th>Break Hours</th>
                        <th>Overtime Hours</th>
                        <th>Total Hours Worked</th>
                        <th>Leave Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userdata.map((data) => (
                        <tr style={{fontSize:"15px"}} key={data.id}>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize:"15px" }}>{data.id}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.name}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.date}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.month}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.start.substring(11, 16)}</td> {/* Extract time from datetime string */}
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.end.substring(11, 16)}</td> {/* Extract time from datetime string */}
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.shift}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.workedhours}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.breakhour}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.overtimehours}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.Total_hours_worked}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.leavetype}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}

                {showAttendancePicker && (
                 <div className='attendance-container'>
                 <div style={{fontFamily:"serif",fontSize:"25px",color:"darkcyan",whiteSpace:"nowrap"}}>Attendance Report</div><br/>
                 <DatePicker
                   selected={myDay}
                   onChange={(date) => setMyDay(date)}
                   dateFormat='MM/yyyy'
                   showMonthYearPicker
                 />
                 <div style={{marginLeft:'35%',marginTop:"10%"}}>
                   <button style={{backgroundColor:"powderblue",fontWeight:"bold",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}} 
                   onClick={handleAttendanceClick}>View</button>
                 </div>
                 </div>
                 )}
                {showAttendanceTable && (
                <div className='attendance-table-container'>
                    <table className="table table-hover">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Month</th>
                        <th>Total Days In Month</th>
                        <th>Present Days</th>
                        <th>CL Taken</th>
                        <th>SL Taken</th>
                        <th>Weekoff Used</th>
                        <th>Remaining week0ff</th>
                        <th>Absent Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userexportdata.map((data) => {
                        // Specify the ID for which you want to display the attendance report
                        const targetId = id;
                        // Display the attendance report only for the specified ID
                        if (data.id === targetId) {
                            return (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.month}</td>
                                <td>{data.Days_in_a_month}</td>
                                <td>{data.workingdays}</td>
                                <td>{data.CL_Taken}</td>
                                <td>{data.SL_Taken}</td>
                                <td>{data.weekoff_used}</td>
                                <td>{data.remaining_weekoff}</td>
                                <td>{data.loss_of_pay}</td>
                            </tr>
                            );
                        }
                        return null; // Skip rendering for other IDs
                        })}
                    </tbody>
                    </table>
                </div>
                )}

                {showOvertimePicker && (
                 <div className='overtime-container'>
                <div style={{fontFamily:"serif",fontSize:"25px",color:"darkcyan",whiteSpace:"nowrap"}}>Overtime Report</div><br/>
                 <DatePicker
                   selected={myDay}
                   onChange={(date) => setMyDay(date)}
                   dateFormat='MM/yyyy'
                   showMonthYearPicker
                 />
                 <div style={{marginLeft:'30%',marginTop:"10%"}}>
                   <button style={{backgroundColor:"powderblue",fontWeight:"bold",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}} 
                   onClick={handleOvertimeClick}>View</button>
                 </div>
                 </div>
                 )}
                 {showOvertimeTable && (
                <div className='overtime-table-container'>
                    {userdata.filter((data) => {
                    const overtime = moment.duration(data.overtimehours).asHours();
                    return overtime > 0;
                    }).length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Month</th>
                            <th>Overtime Hours</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userdata.map((data) => {
                            const overtime = moment.duration(data.overtimehours).asHours();
                            if (overtime > 0) {
                            return (
                                <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.date}</td>
                                <td>{data.month}</td>
                                <td>{data.overtimehours}</td>
                                </tr>
                            );
                            } else {
                            return null;
                            }
                        })}
                        </tbody>
                    </table>
                    ) : (
                    <p style={{marginLeft:"-18%"}}>No overtime done.</p>
                    )}
                </div>
                )}

              {showPayrollPicker && (
                 <div className='payroll-container'>
                 <div style={{fontFamily:"serif",fontSize:"25px",color:"darkcyan",whiteSpace:"nowrap"}}>Payroll Report</div><br/>
                 <DatePicker
                   selected={myDay}
                   onChange={(date) => setMyDay(date)}
                   dateFormat='MM/yyyy'
                   showMonthYearPicker
                 />
                 <div style={{marginLeft:'26%',marginTop:"10%"}}>
                   <button style={{backgroundColor:"powderblue",fontWeight:"bold",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}} 
                   onClick={handlePayrollClick}>View</button>
                </div>
                </div>
              )}

            {showPayrollTable && (
              <div className='payroll-table-container'>
                <div style={{fontFamily:"serif",fontSize:"22px",color:"darkcyan",whiteSpace:"nowrap"}}>Salary Summary</div><br/>
                {userexportdata.map((data) => {
                        // Specify the ID for which you want to display the attendance report
                        const targetId = id;
                        // Display the attendance report only for the specified ID
                        if (data.id === targetId) {
                            return (
                              <div>
                              <div className="details-row">
                              <div className="details-heading">No.Of Working Days </div>
                              <div className="colon">:</div>
                              <div className="details-value">{3}</div>
                            </div>
                            <div className="details-row">
                              <div className="details-heading">No.Of Leave Days </div>
                              <div className="colon">:</div>
                              <div className="details-value">{4}</div>
                            </div>
                            <div className="details-row">
                              <div className="details-heading">Overtime in Hrs </div>
                              <div className="colon">:</div>
                              {/* {userdata.map((user) => {
                                const targetId = id;
                                if (data.id === targetId) {
                              const lastTotalOvertimeHrs = userdata[userdata.length - 1].Total_overtime_hrs;
                                    return (
                              <div className="details-value">{lastTotalOvertimeHrs}</div>
                                    )
                                }
                              })} */}
                              <div className="details-value">{data.Total_overtime_hrs}</div>
                            </div>
                            <div className="details-row">
                              <div className="details-heading" style={{whiteSpace:"pre-wrap"}}>Late login and early logout in Hrs</div>
                              <div className="colon">:</div>
                              <div className="details-value">{data.Total_overtime_hrs}</div>
                            </div>
                            <div className="details-row">
                              <div className="details-heading">Basic Salary</div>
                              <div className="colon">:</div>
                              <div className="details-value">{employee.salary}</div>
                            </div>
                            <div className="details-row">
                              <div className="details-heading">Net Salary</div>
                              <div className="colon">:</div>
                              {/* <div className="details-value">{420}</div> */}
                              <div className="details-value">{1860}</div>
                            </div>
                            </div>
                            );
                        }
                        return null; 
                      })
                    }
              </div>
            )}

            {showEmpolyeeHours && (
            <div className="EmployeeHours-container">
              <div style={{fontFamily:"serif",fontSize:"25px",color:"darkcyan",whiteSpace:"nowrap"}}>Employee Hours Report</div><br/>
            <div className="monthyear">
            <label htmlFor="date">Select Month & Year:</label>
            <DatePicker
              selected={selectedMonthYear}
              onChange={handleMonthYearChange}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              popperClassName="some-custom-class"
              popperPlacement="bottom"
              popperModifiers={[
                {
                  name: "offset",
                  options: {
                    offset: [5, 10],
                  },
                },
                {
                  name: "preventOverflow",
                  options: {
                    rootBoundary: "viewport",
                    tether: false,
                    altAxis: true,
                  },
                },
              ]}
            />
          </div>
          <div className="daymonthyear">
            <label htmlFor="date">Select Date:</label>
            <DatePicker
              style={{ fontWeight: "bold" }}
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className="centered-datepicker"
              popperClassName="some-custom-class"
              popperPlacement="bottom"
              popperModifiers={[
                {
                  name: "offset",
                  options: {
                    offset: [5, 10],
                  },
                },
                {
                  name: "preventOverflow",
                  options: {
                    rootBoundary: "viewport",
                    tether: false,
                    altAxis: true,
                  },
                },
              ]}
            />
          </div>
          <div style={{marginLeft:'15%',marginTop:"10%"}}>
            <button style={{backgroundColor:"powderblue",fontWeight:"bold",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}} 
              onClick={handleEmployeeHoursClick}>View</button>
          </div>
          <div style={{marginLeft:'55%',marginTop:"-17%"}}>
            <button title="Download CSV" style={{backgroundColor:"powderblue",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}}>
              <CSVLink style={{fontSize:'30px',color:"white",fontWeight:"bold",textAlign:"center"}} className="bi bi-download" data={Userempdata} filename={name1}></CSVLink></button>
          </div>
        </div>
        )}

            {showEmployeeHoursTable && (
                <div className='employeehours-table-container'>
                    <table className="table table-hover">
                    <thead style={{fontSize:"15px"}} >
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Late Login</th>
                        <th>Total Late Login</th>
                        <th>Early Logout</th>
                        <th>Total Early Logout</th>
                        <th>Total Late Login & Early Logout</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Userempdata.map((data) => (
                        <tr style={{fontSize:"15px"}} key={data.id}>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize:"15px" }}>{data.id}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.name}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.date}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.latelogin}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.totallatelogin}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.earlyLogout}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.Totalearlylogouttime}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.totlateearlyhours}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}

                <div >    
                {showTables && (
                <>
                <div style={{fontFamily:"serif",fontSize:"25px",color:"darkcyan",marginLeft:"35%",marginTop:"4%"}}>{employee.name}'s Details</div><br/>
                <div style={{ display: "flex" }}>
                <div className="employee-details-container">
                <div className="details-row">
                    <div className="details-heading">Employee ID</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.id}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Mobile</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.mobile}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Email</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.email}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Department</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.department}</div>
                </div>
                {employee.department === "DOCTOR" && (
                    <div className="details-row">
                    <div className="details-heading">TNMCNO</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.TNMCNO}</div>
                    </div>
                )}
                {employee.department === "NURSE" && (
                    <React.Fragment>
                    <div className="details-row">
                        <div className="details-heading">RNRNO</div>
                        <div className="colon">:</div>
                        <div className="details-value">{employee.RNRNO}</div>
                    </div>
                    <div className="details-row">
                        <div className="details-heading">ValidityDate</div>
                        <div className="colon">:</div>
                        <div className="details-value">{employee.ValidlityDate}</div>
                    </div>
                    </React.Fragment>
                )}
                <div className="details-row">
                    <div className="details-heading">Designation</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.designation}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Gender</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.Gender}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Blood Group</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.BloodGroup}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Dob</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.dob.substring(0, 16)}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Maritalstatus</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.Maritalstatus}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Aadhaar Number</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.Aadhaarno}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Bank Account Number</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.bankaccnum}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Pan Number</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.PanNo}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Identification Mark</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.IdentificationMark}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Languages Known</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.languages}</div>
                </div>
                </div>
                        <div style={{marginLeft:"2%",marginTop:"2%"}}>
                        <caption style={{fontFamily:"serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Education Data</caption><br/>
                            {educationData ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>SlNo</th>
                                            <th>Degree</th>
                                            <th>Major</th>
                                            <th>Institution</th>
                                            <th>Marks</th>
                                            <th>Division</th>
                                            <th>Year</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {educationData.map((edu, index) => (
                                            <tr key={index}>
                                                <td>{edu.SlNo}</td>
                                                <td>{edu.degree}</td>
                                                <td>{edu.major}</td>
                                                <td>{edu.institution}</td>
                                                <td>{edu.marks}</td>
                                                <td>{edu.division}</td>
                                                <td>{edu.year}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No education data available</p>
                            )}
                        </div>
                        </div>

                        <div style={{ display: "flex",marginLeft: '2%' ,marginTop:"4%"}}>
                        <div>
                        <caption style={{fontFamily:"serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Experience Data</caption><br/>
                            {experienceData ? (
                                <table className="table table-hover">
                                    <thead className='thead'>
                                        <tr>
                                            <th>SlNo</th>
                                            <th>Organization</th>
                                            <th>Designation</th>
                                            <th>Last Drawn Salary</th>
                                            <th>Location</th>
                                            <th>Experience</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {experienceData.map((exp, index) => (
                                            <tr key={index}>
                                                <td>{exp.SlNo}</td>
                                                <td>{exp.Organization}</td>
                                                <td>{exp.designation}</td>
                                                <td>{exp.lastdrawnsalary}</td>
                                                <td>{exp.location}</td>
                                                <td>{exp.experience}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No experience data available</p>
                            )}
                        </div>
                        <div style={{ marginLeft: '2%' }}>
                        <caption style={{fontFamily:"serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reference Data </caption><br/>
                            {referenceData ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>SlNo</th>
                                            <th>References</th>
                                            <th>Organization</th>
                                            <th>Designation</th>
                                            <th>Contact No.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referenceData.map((ref, index) => (
                                            <tr key={index}>
                                                <td>{ref.SlNo}</td>
                                                <td>{ref.references}</td>
                                                <td>{ref.Organization}</td>
                                                <td>{ref.designation}</td>
                                                <td>{ref.ContactNo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No reference data available</p>
                            )}
                        </div>
                        </div>
                    </>
                )}
            </div>
            </body>
        </React.Fragment >
    );
}
export default DownloadButton;