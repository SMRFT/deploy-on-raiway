import React, { useState, useEffect, useCallback, useRef} from "react";
import axios from 'axios';
import * as ReactBootStrap from "react-bootstrap";
import { Modal, Button , OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import EditForm from "./EditForm";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import Pagination from "react-js-pagination";
import { useMemo } from "react";
import Card from 'react-bootstrap/Card';
import "./Viewemp.css";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import MUIButton from '@material-ui/core/Button';
import Summary from "./Summary";
import { IconButton } from '@material-ui/core';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { red } from "@material-ui/core/colors";
import Myconstants from './Myconstants';
import { BsPersonFill, BsPersonDash, BsCheckLg } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';


///view employee
const Home = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState({ blogs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:7000/attendance/showemp")
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

 
 
  //hide and show actions
  const showActionsBoxRef = useRef(null); 
  const [showaction, setShowaction] = useState(false);
  const [showActionsBox, setShowActionsBox] = useState(false);
  const [selectedUseraction, setSelectedUseraction] = useState(null);
  const handleHide = (user) => {
    setShowaction(true);
    setShowActionsBox(!showActionsBox);
    setSelectedUseraction(user);
  };
  const handleOutsideClick = (event) => {
    if (
      showActionsBoxRef.current &&
      !showActionsBoxRef.current.contains(event.target)
    ) {
      setShowActionsBox(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  function refreshPage() {
    {
      window.location.reload();
    }
  }
  
//summary model code:
const [showModal, setShowModal] = useState(false);
const handleShowModal = () => {
  setShowModal(true);
};
const handleCloseModal = () => {
  setShowModal(false);
};

  //Navigate to Calendar
  const navigate = useNavigate();
  const navigateToCalendar = () => {
  };
 //Navigate to Files
  const Fileviewer = useNavigate();
  const navigateToFileviewer = () => {
  };

  ///delete employee
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedEmployeeToDelete, setSelectedEmployeeToDelete] = useState(null);

  const openDeleteConfirmation = (employee) => {
    setSelectedEmployeeToDelete(employee);
    setShowDeleteConfirmation(true);
  };

  const deleteEmployee = (employee) => {
    openDeleteConfirmation(employee);
  };
    

  const handleConfirmDelete = async () => {
  if (selectedEmployeeToDelete) {
    try {
      await fetch("http://127.0.0.1:7000/attendance/delemp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: selectedEmployeeToDelete.id,
        }),
      });

      // Update the state to remove the deleted employee without refreshing
      setUsers((prevUsers) => {
        return { blogs: prevUsers.blogs.filter((user) => user.id !== selectedEmployeeToDelete.id) };
      });

      // Close the confirmation modal
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.log(error);
    }
  }
};
  
// fetch the data from the server and update the state
const [breakusers, setBreakusers] = useState([]);
const [employeesOnBreak, setEmployeesOnBreak] = useState([]);
const [employeesActive, setEmployeesActive] = useState([]);
const [employeesNotActive, setEmployeesNotActive] = useState([]);
const fetchData = useCallback(() => {
  fetch("http://127.0.0.1:7000/attendance/breakdetails")
    .then((res) => res.json())
    .then(
      (data) => {
        setIsLoaded(true);
        setBreakusers(data);
        setEmployeesOnBreak(data.employees_on_break);
        setEmployeesActive(data.employees_active);
        setEmployeesNotActive(data.employees_not_active);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
}, []);
 // initially set to "active"
// Call the fetchData function when the component mounts
// refresh the details every 3 minutes
useEffect(() => {
  fetchData();
  const interval = setInterval(() => {
    fetchData();
  }, 10000); // 3 minutes = 180000 milliseconds
  return () => clearInterval(interval);
}, [fetchData]);

//Bulk Upload
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      // Assuming the Excel sheet is named 'employees'
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Convert Excel data to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      // Send JSON data to your backend API
      await uploadEmployeeData(jsonData);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
    }
  };
  reader.readAsArrayBuffer(file);
};
const uploadEmployeeData = async (jsonData) => {
  try {
    // Send the JSON data to your backend API endpoint
    const response = await axios.post('http://127.0.0.1:7000/attendance/upload-employees/', {
      employees: jsonData,
    });
    // Handle the response if needed
    console.log('Employees uploaded successfully', response.data);
  } catch (error) {
    // Handle error
    console.error('Error uploading employees:', error);
  }
};


// ///search employee
const [employeeType, setEmployeeType] = useState("");
const [employeeCategoryType, setCategoryType] = useState("");
const [selectedDepartment, setSelectedDepartment] = useState("all");
const DEPARTMENT_OPTIONS = Myconstants.departments.map((department) => department.toUpperCase());
const [searchString, setSearchString] = useState("");
const [listType, setListType] = useState("all");
const [selectedRole, setSelectedRole] = useState("all");
const [employeeFilter, setEmployeeFilter] = useState("all");

const handleEmployeeFilterChange = (value) => {
  setEmployeeFilter(value);
  const [type, selectedValue] = value.split("_");
  if (type === "type") {
    setEmployeeType(selectedValue);
    setCategoryType("all");
  } else if (type === "category") {
    setCategoryType(selectedValue);
    setEmployeeType("all");
  }
};

const filterByDepartment = (employee) => {
  if (selectedDepartment === "all") {
    return true; // Show all employees when "All Departments" is selected
  } else {
    return employee.department.toUpperCase() === selectedDepartment.toUpperCase();
  }
};

const filteredResults = useMemo(() => {
  return (
    users.blogs &&
    users.blogs.filter((employee) => {
      const matchesSearch = Object.values(employee).some((value) =>
        value?.toString().toLowerCase().includes(searchString?.toString().toLowerCase() ?? "")
      );
      const matchesDepartment = filterByDepartment(employee);
      const matchesListType =
        listType === "all" ||
        (listType === "active" && employeesActive.some((activeEmployee) => activeEmployee.id === employee.id)) ||
        (listType === "notActive" &&
          employeesNotActive.some((notActiveEmployee) => notActiveEmployee.id === employee.id));

      const matchesEmploymentCategory = employeeFilter === "all" ||
      employeeCategoryType === "all" || employee.employmentCategory === employeeCategoryType;

      const matchesEmployeeType = employeeFilter === "all" ||
        employeeType === "all" || employee.employeeType === employeeType;

      return matchesSearch && matchesDepartment && matchesListType && matchesEmploymentCategory && matchesEmployeeType;
    })
  );
}, [users.blogs, searchString, employeeType, selectedDepartment, listType, employeesActive, employeesNotActive, selectedRole]);

  const countFilteredResults = filteredResults.length;
  const countData = users.blogs.length;

// State to keep track of the current page
const [activePage, setActivePage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
// Function to handle page change
const handlePageChange = (pageNumber) => {
  setActivePage(pageNumber);
};
const handleItemsPerPageChange = (event) => {
  setItemsPerPage(parseInt(event.target.value));
  setActivePage(1);
};
const handleclicktoaddemp = () => {
  navigate('/Admin/addemp'); // Navigate to login page after logout
}
const startIndex = (activePage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const displayedResults = filteredResults.slice(startIndex, endIndex);
// Number of items to show per page
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
// Get the index of the first and last items to show on the current page
const indexOfLastItem = activePage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// Slice the filtered results to show only the items for the current page
const paginatedResults = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {

 
    return (
      <body><br/>
      <div className="viewemp">
        <Link style={{color:"rgb(103, 180, 204)"}} to="/Admin/ViewempTable">Table View</Link>
        <br/><br/>
<div className="row">
  <div className="col-lg-3">
    <select style={{ marginLeft:"5px",borderRadius: '10px',fontSize:"14px",fontFamily:"serif",height:"1cm",textAlign:"center",borderColor:"rgb(103, 180, 204)",borderWidth:"2px",color:'rgb(145, 180, 204)'}}
    id="listType"  value={listType} onChange={(e) => setListType(e.target.value)}>
      <option value="all">All Employees</option>
      <option value="active">Active Employees</option>
      <option value="notActive">Not Active Employees</option>
    </select>
  </div>
  <div className="col-lg-3" style={{ marginLeft: "-10%" }}>
  <select
    style={{      borderRadius: "10px",
      fontSize: "14px",
      fontFamily: "serif",
      height: "1cm",
      textAlign: "center",
      borderColor: "rgb(103, 180, 204)",
      borderWidth: "2px",
      color: "rgb(145, 180, 204)",
    }}
   id="department"
    value={selectedDepartment}
    onChange={(e) => setSelectedDepartment(e.target.value)}
  >
      <option value="all">All</option>
    {DEPARTMENT_OPTIONS.map((department) => (
      <option key={department} value={department}>
        {department}
      </option>
    ))}
  </select>
  </div>
  <div className="col-lg-3" style={{ marginLeft: "-8%" }}>
  <select
    style={{
      borderRadius: '10px',
      fontSize: '14px',
      fontFamily: 'serif',
      width: '4cm',
      height: '1cm',
      textAlign: 'center',
      borderColor: 'rgb(103, 180, 204)',
      borderWidth: '2px',
      color: 'rgb(145, 180, 204)',
    }}
    id="employeeFilter"
    value={employeeFilter}
    onChange={(e) => handleEmployeeFilterChange(e.target.value)}
  >
    <option value="all">All Employees</option>
    {Myconstants.employeeTypeOptions.map((typeOption) => (
      <option key={`type_${typeOption.value}`} value={`type_${typeOption.value}`}>
        {typeOption.label}
      </option>
    ))}
    {Myconstants.employmentCategoryOptions.map((categoryOption) => (
      <option key={`category_${categoryOption.value}`} value={`category_${categoryOption.value}`}>
        {categoryOption.label}
      </option>
    ))}
  </select>
</div>

  <button className="col-lg-3 viewEmp-button"
  style={{ marginLeft: "-10%" }}
  color="primary"
  onClick={handleShowModal}
  title="Download Employee Summary">
<CloudDownloadIcon/>
</button>
<button className="col-lg-3 viewEmp-button" onClick={handleclicktoaddemp} title="Add New Employee">
  <PersonAddIcon/>
</button>
<button className="col-lg-3 viewEmp-button" title="Employee Details Bulk Upload to Database">
<label htmlFor="file-upload" >
    <FontAwesomeIcon style={{cursor:"pointer"}} icon={faUpload} className="upload-icon" />
</label>
<input id="file-upload" type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
</button>

<div className="col-lg-4">
      <div className="form-outline">
        <input style={{ height:"1.1cm",borderColor:"rgb(103, 180, 204)",borderRadius:10,
        borderWidth:"2px",color:'rgb(145, 180, 204)',marginLeft:"2%",paddingLeft:"2.5rem",width:"50%"}}
        type="search" id="form1" className="form-control" value={searchString}
            onChange={(e) => setSearchString(e.target.value)} />
        <button type="button" style={{position: 'absolute',left: '1rem',top: '0.6rem',
        backgroundColor: 'transparent',border: 'none',outline: 'none',color:"rgb(103, 180, 204)"}}>
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
<div className="col-lg-2 employee-count" style={{marginLeft:"-15%",marginTop:"0.5%"}}>
    {filteredResults.length > 0 ? (
      <>{countFilteredResults} Employees</>
    ) : (
      <>0 Employees</>
    )}
  </div>
</div>
 <br/>    
 <div className="row">
  {paginatedResults.map((user) => (
    <div className="col-md-3 mb-3" key={user.id} style={{ borderRadius: "5px" }}>
     <Card md={4} className="employee"><br/>
     
     <div>
       <i style={{ float: "right", marginRight: '5%', marginTop: "-7%", cursor: "pointer" }} onClick={() => handleHide(user)} className="fa fa-ellipsis-h"></i>
       <div className="button-container" style={{ float: "left", marginRight: "5%", marginTop: "-12%" }}>
         {employeesOnBreak.some((breakUser) => breakUser.id === user.id) ? (
           <FaClock className="break-btn" style={{ color: "blue", fontSize: "150%" }} />
         ) : employeesActive.some((activeUser) => activeUser.id === user.id) ? (
           <BsPersonFill className="active-icon" style={{ color: "green", fontSize: "150%"  }} />
         ) : (
           <BsPersonDash className="not-active-icon" style={{ color: "red", fontSize: "150%"  }} />
         )}
       </div>

{showActionsBox && selectedUseraction === user && (
 <div
   ref={showActionsBoxRef}
   style={{
     position: "absolute",
     borderRadius:"5%",
     backgroundColor:"ghostwhite",
     boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
     padding: "4px 4px",
     zIndex: 1,
     top: "40px",
     right: 0
   }}
   >
       <button
         onClick={() => deleteEmployee(user)}
         className="btn btn-act"
         data-toggle="modal"
         style={{border:"none",color:'red'}}
       >
       <i className="bi bi-trash-fill"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px",fontSize:"14px"}}> Delete</div>
     </button><br/>
     <Link
         to={`/AdminCalendar/${user.name + '_' + user.id}`}
         activeClassName="current">
         <button
           onClick={() => navigateToCalendar(user)}
           className="btn btn-act"
           data-toggle="modal"
           style={{border:"none",color:"blue"}}
         >
         <i className="bi bi-calendar3-week"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px",fontSize:"14px"}}> Calendar</div>
         </button>
       </Link><br/>
       <Link
         to={`/Fileviewer/${user.name + '_' + user.id}`}
         activeClassName="current"
         >
         <button
           onClick={() => navigateToFileviewer(user)}
           className="btn btn-act"
           data-toggle="modal"
           style={{border:"none",color:"ThreeDDarkShadow"}}
         >
         <i className="bi bi-eye"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px",fontSize:"14px"}}>View more</div>
         </button>
       </Link><br/>
       </div> )}
       </div>
 <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',marginRight:"11%"}}>
 <img
   src={`http://127.0.0.1:7000/attendance/get_file?filename=${user.name + '_' + user.id + '_' + 'profile' + '.jpg'}`}
   style={{
     width: '80px',
     height: '80px',
     borderRadius: '50%',
     marginTop:'-10%'
   }}
   alt="Profile Picture"
 />

 <div >
   <div style={{ color: "#525E75", fontWeight: "bold", fontFamily: "'Latobold', sans-serif", fontSize: "14px" }}>
     {user.id} - {user.name}
   </div>
   <div style={{ color: "#BFBFBF", fontFamily: "'LatoWeb', sans-serif", fontSize: "13px" }}>
     {user.department}
   </div>
   <div style={{ color: "#525E75", fontFamily: "'LatoWeb', sans-serif", fontSize: "13px" }}>
     {user.email}
   </div>
 </div>
</Card.Body>

</Card>
    </div>
    ))}
    </div>
    <>
    <Modal show={showModal} onHide={handleCloseModal} className="summary-modal">
  <Modal.Header closeButton>
    <Modal.Title>Summary</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ marginLeft:"-30%",display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Summary />
  </Modal.Body>
  <Modal.Footer style={{ height: "5%" }}>
    <Button variant="danger" onClick={handleCloseModal} style={{ width: "30%", fontSize: "15px", marginTop:"1%" }}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

<Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
  <Modal.Header style={{ padding: "2%"}} closeButton>
    <Modal.Title style={{fontFamily:"serif"}}>Confirm Delete</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete this employee?
  </Modal.Body>
  <Modal.Footer style={{ padding: "1%" }}>
    <Button style={{ padding: "1%",fontFamily:"serif",fontSize:"18px" }} variant="danger" onClick={handleConfirmDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>


    </>
    <div style={{float:"left",marginTop:"10px"}}>
      <span style={{fontSize:"18px",color: 'rgb(103, 180, 204)',fontFamily:"cursive"}}>Views per page: </span>
      <select style={{height:"1cm",textAlign:"center",fontSize:"14px",borderRadius:5,color: 'rgb(155, 180, 204)',borderColor:"rgb(103, 180, 204)"}} 
      value={itemsPerPage} onChange={handleItemsPerPageChange}>
        {ITEMS_PER_PAGE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <div className="pagination-container">
      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={filteredResults.length}
        pageRangeDisplayed={20}
        onChange={handlePageChange}
        itemClass="page-item"
        linkClass="page-link"
        prevPageText="Prev"
        nextPageText="Next"
        selectableRows
      />
    </div>
    </div>
    </body >
    );
  }
};
export default Home;