import React, { useState, useEffect, useCallback, useRef} from "react";
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
///view employee
const Home = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState({ blogs: [] });
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
  const showActionsBoxRef = useRef(null); // Ref for the showActionsBox element
  // const [showActionsBox, setShowActionsBox] = useState(false);
  // const [selectedUseraction, setSelectedUseraction] = useState(null);
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
//Navigate to EditForm
const EditForm = useNavigate();
const navigateToEditForm = () => {
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
  const deleteEmployee = async (e) => {
    if (window.confirm("Are you sure you want to delete this employee?"))
      await fetch("http://127.0.0.1:7000/attendance/delemp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: e.id,
        }),
      });
    window.location.reload(true);
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

useEffect(() => {
  fetchData();

}, [fetchData]);
   ///search employee
  const [listType, setListType] = useState("all");

  const [searchString, setSearchString] = useState("");
  const filteredResults = users.blogs && users.blogs.filter((employee) => {
    // Check if employee name or ID matches the search string
    const matchesSearch = Object.values(employee).some((value) =>
      value?.toString().toLowerCase().includes(searchString?.toString().toLowerCase() ?? "")
    );
  
    // Check if employee is active, not active, or on break, depending on the listType state
    if (listType === "active") {
      return employeesActive.some((activeEmployee) => activeEmployee.id === employee.id) && matchesSearch;
    } else if (listType === "notActive") {
      return employeesNotActive.some((notActiveEmployee) => notActiveEmployee.id === employee.id) && matchesSearch;
    } else if (listType === "break") { // Added condition for "break"
      return employeesOnBreak.some((breakEmployee) => breakEmployee.id === employee.id) && matchesSearch;
    } else {
      return matchesSearch;
    }
  });
  
  
  
  
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
      <body  className="viewemp">
        <br />
        <div className="input-group">
      <div className="form-outline">
        <input type="search" id="form1" className="form-control" value={searchString}
            onChange={(e) => setSearchString(e.target.value)} />
        <button type="button" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
<div className="employee-count">
  {filteredResults.length > 0 ? (
    <>{countFilteredResults} Employees</>
  ) : (
    <>0 Employees</>
  )}
</div>

<div className="filter">
  <label htmlFor="listType" style={{color:"rgb(103, 180, 204)",fontWeight:"bold",fontFamily:"-moz-initial"}}> Employee: </label>
  <select style={{ marginLeft:"5px",borderRadius: '10px',fontSize:"14px",fontFamily:"serif",height:"1cm",textAlign:"center",borderColor:"rgb(103, 180, 204)",borderWidth:"2px",color:'rgb(145, 180, 204)'}} 
  id="listType"  value={listType} onChange={(e) => setListType(e.target.value)}>
    <option value="all">All Employees</option>
    <option value="active">Active Employees</option>
    <option value="notActive">Not Active Employees</option>
    <option value="break"> break Employees</option>
  </select>
</div>
<button className="summary-button"
  color="primary"
  onClick={handleShowModal}
  title="Overall employee Summary download"
>
<CloudDownloadIcon style={{ fontSize: 40 }} />
  <span style={{ marginLeft: '5px' }}></span>
</button>
<button className="add-emp-button" onClick={handleclicktoaddemp} title="Adding New Employee">
  <PersonAddIcon style={{ fontSize: 40 }} />
</button>

<br/>
   <div className="row">
    {paginatedResults.map((user) => (
   <div className="col-md-3 mb-3" key={user.id} style={{  padding: "10px", borderRadius: "5px" }}>
    <Card md={4} className="employee"><br/>
   <div><i style={{float:"right",marginRight:'5%',marginTop:"-4%",cursor:"pointer"}} onClick={() => handleHide(user)} className="fa fa-ellipsis-h"></i>
   <div style={{ float: "right", marginRight: "5%",marginTop:"-5%" }}>
  {employeesOnBreak.some((breakUser) => breakUser.id === user.id) ? (
    <button className="break-btn">Break</button>
  ) : employeesActive.some((activeUser) => activeUser.id === user.id) ? (
    <button className="active-btn">Active</button>
  ) : (
    <button className="not-active-btn">Not Active</button>
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
      top: "50px",
      right: 0
    }}
    >
        <button
          onClick={() => deleteEmployee(user)}
          className="btn text-danger btn-act"
          data-toggle="modal"
          style={{border:"none"}}
        >
        <i className="bi bi-trash-fill"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px"}}> Delete</div>
      </button><br/>
      <Link
          to={`/AdminCalendar/${user.name + '_' + user.id}`}
          activeClassName="current">
          <button
            onClick={() => navigateToCalendar(user)}
            className="btn text-primary btn-act"
            data-toggle="modal"
            style={{border:"none"}}
          >
          <i className="bi bi-calendar3-week"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px"}}> Calendar</div>
          </button>
        </Link><br/>
        <Link
          to={`/Fileviewer/${user.name + '_' + user.id}`}
          activeClassName="current"
          >
          <button
            onClick={() => navigateToFileviewer(user)}
            className="btn text-primary btn-act"
            data-toggle="modal"
            style={{border:"none"}}
          >
          <i className="bi bi-file-earmark-text"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px"}}>Files</div>
          </button>
        </Link><br/>
        </div> )}
        </div><br/><br/>
        <img src={`http://localhost:7000/attendance/profile_image?profile_picture_id=${user.profile_picture_id}`}   style={{
            display: "block",
            margin: "auto",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
          }} alt="Profile Picture" />
      <Card.Body>
        <Card.Title><div><center style={{color:"#525E75",font:"caption",fontWeight:"bold",fontFamily:"sans-serif",fontSize:"14px"}}>{user.name}</center></div>
        <div><center style={{color:"#BFBFBF",font:"caption",fontFamily:"initial"}}>{user.id}</center>
        <center style={{color:"#BFBFBF",font:"caption",fontFamily:"initial"}}>{user.designation}</center></div></Card.Title>
        <Card.Text>        
        <Button style={{backgroundColor:"#ECFCFF",color:"black",width:"120%",borderColor:"#C8E6F5",marginLeft:"-45px"}}>
        <div style={{color:"#7F8487",float:"left",font:"caption",fontFamily:"cursive",fontSize:"12px"}}>Department</div>
        <div style={{color:"#7F8487",float:"right",font:"caption",fontFamily:"cursive",fontSize:"12px"}}>Date Hired</div><br/>
        <div style={{float:"left",font:"caption",fontFamily:"Garamond",fontSize:"12px"}}>{user.department}</div>
        <div style={{float:"right",font:"caption",fontFamily:"Times New Roman",fontSize:"12px"}}>{user.dateofjoining}</div><br/><br/>
        <div style={{float:"left",font:"caption",fontFamily:"Copperplate",fontSize:"13px"}}>
          <i style={{fontWeight:"bold",fontSize:"16px", color: "black", textShadow: "0.4px 0.4px black"}} className="bi bi-envelope"></i> {user.email}
        </div><br/>
        <div style={{float:"left",font:"caption",fontFamily:"Copperplate",fontSize:"14px"}}>
          <i style={{fontWeight:"bold",fontSize:"14px", color: "black", textShadow: "0.4px 0.4px black"}} className="bi bi-telephone"></i> {user.mobile}
        </div><br/> 
        <center><i style={{fontWeight:"bold",fontSize:"16px", color: "black", textShadow: "0.4px 0.4px black",textAlign:"center"}} className="bi bi-house-door"></i></center>
        <div style={{textAlign:"center",font:"caption",fontFamily:"Copperplate",fontSize:"14px"}}>
          {user.address}
        </div>
        </Button>
        </Card.Text>
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
        <Modal.Body>
          <Summary />
        </Modal.Body>
        <Modal.Footer style={{ height: "40px" }}>
  <Button variant="danger" onClick={handleCloseModal} style={{ width: "100px", fontSize: "15px", marginTop:"-18px" }}>
    Close
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
    </body >
    );
  }
};
export default Home;