import React, { useState, useEffect,useCallback,useRef } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import EditForm from "./EditForm";
import Summary from "./Summary";
import "./Viewemp.css";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Myconstants from './Myconstants';
import { useMemo } from "react";
import "./Viewemp.css";
import TablePagination from '@material-ui/core/TablePagination';

///view employee
const Home = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset the page when changing rows per page
  };
  
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 

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

  ////edit employee
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  useEffect(() => {
    handleClose();
  }, []);
  const [selectedUser, setselectedUser] = useState(null);
  const editEmployee = async (selectedEmployee) => {
    setselectedUser(selectedEmployee);
    setShow(true);
  };
  //Navigate to Calendar
  const navigate = useNavigate();
  const navigateToCalendar = () => {
  };

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

  //summary model code:
const [showModal, setShowModal] = useState(false);
const handleShowModal = () => {
  setShowModal(true);
};
const handleCloseModal = () => {
  setShowModal(false);
};
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

// ///search employee
const [listType, setListType] = useState("all");
const DEPARTMENT_OPTIONS = Myconstants.departments.map((department) => department.toUpperCase());
const [selectedDepartment, setSelectedDepartment] = useState("all");
const [selectedRole, setSelectedRole] = useState("all");
const [searchString, setSearchString] = useState("");



const filterByDepartment = (employee) => {
  if (selectedDepartment === "all") {
    return true; // Show all employees when "All Departments" is selected
  } else {
    return employee.department.toUpperCase() === selectedDepartment.toUpperCase();
  }
};

const filteredResults = useMemo(() => {
  if (!users.blogs) {
    return []; // Return an empty array if users.blogs is falsy
  }

  const filteredEmployees = users.blogs.filter((employee) => {
    const matchesSearch = Object.values(employee).some((value) =>
      value?.toString().toLowerCase().includes(searchString?.toString().toLowerCase() ?? "")
    );

    const matchesDepartment = filterByDepartment(employee);

    if (listType === "active") {
      return (
        employeesActive.some((activeEmployee) => activeEmployee.id === employee.id) &&
        matchesDepartment
      );
    } else if (listType === "all") {
      return matchesSearch && matchesDepartment;
    } else if (listType === "notActive") {
      return (
        employeesNotActive.some((notActiveEmployee) => notActiveEmployee.id === employee.id) &&
        matchesDepartment
      );
    }

    return false; // Default case: return false if no conditions match
  });

  return filteredEmployees;
}, [users.blogs, searchString, selectedRole, selectedDepartment, listType]);




  const getClassForEmployee = (employee) => {
    if (employeesOnBreak.some((breakEmployee) => breakEmployee.id === employee.id)) {
      return "emp-break";
    } else if (employeesActive.some((activeEmployee) => activeEmployee.id === employee.id)) {
      return "emp-active";
    } else {
      return "emp-non-active";
    }
  };
  

  const countFilteredResults = filteredResults.length;
  const countData = users.blogs.length;

const handleclicktoaddemp = () => {
  navigate('/Admin/addemp'); // Navigate to login page after logout
}


const [sortConfig, setSortConfig] = useState({
  column: null,
  direction: 'desc',
});

const sortedUsers = filteredResults.sort((a, b) => {
  if (sortConfig.column === 'id') {
    if (a.id < b.id) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a.id > b.id) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }
  if (sortConfig.column === 'name') {
    if (a.name < b.name) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a.name > b.name) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }
  return 0;
});

const handleSort = (columnName) => {
  if (sortConfig.column === columnName) {
    setSortConfig({
      ...sortConfig,
      direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  } else {
    setSortConfig({ column: columnName, direction: 'asc' });
  }
};

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <body><br/>
      <div className="viewemp">
         <Link style={{color:"rgb(103, 180, 204)"}} to="/Admin/Viewemp">Card View</Link>
         <br/><br/>
<div className="row">
  <div className="col-lg-4">
    <label htmlFor="listType" style={{color:"rgb(103, 180, 204)",fontWeight:"bold",fontFamily:"-moz-initial"}}> Employee: </label>
    <select style={{ marginLeft:"5px",borderRadius: '10px',fontSize:"14px",fontFamily:"serif",height:"1cm",textAlign:"center",borderColor:"rgb(103, 180, 204)",borderWidth:"2px",color:'rgb(145, 180, 204)'}}
    id="listType"  value={listType} onChange={(e) => setListType(e.target.value)}>
      <option value="all">All Employees</option>
      <option value="active">Active Employees</option>
      <option value="notActive">Not Active Employees</option>
    </select>
  </div>
  <div className="col-lg-4" style={{ marginLeft: "-10%" }}>
  <label htmlFor="department" style={{ color: "rgb(103, 180, 204)", fontWeight: "bold", fontFamily: "-moz-initial" }}>
    Department:
  </label>
  <select
    style={{
      marginLeft: "5px",
      borderRadius: "10px",
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
     <option value="all">All </option>
    {DEPARTMENT_OPTIONS.map((department) => (
      <option key={department} value={department}>
        {department}
      </option>
    ))}
  </select>
  </div>
  <button className="col-lg-4 viewEmp-button"
  style={{marginLeft:"-10%"}}
  color="primary"
  onClick={handleShowModal}
  title="Download Employee Summary">
<CloudDownloadIcon/>
</button>
<button className="col-lg-4 viewEmp-button" onClick={handleclicktoaddemp} title="Add New Employee">
  <PersonAddIcon/>
</button>
<div className="col-lg-4" style={{marginLeft:"2%"}}>
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
<div className="col-lg-2 employee-count" style={{marginLeft:"-13%"}}>
    {filteredResults.length > 0 ? (
      <>{countFilteredResults} Employees</>
    ) : (
      <>0 Employees</>
    )}
  </div>
</div> 
        <br/>   
        <div className="col-lg-12">
          <div className="pagination-container">
           <TablePagination
          component="div"
          count={filteredResults.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
</div>
<br/><br/><br/>
        <div class="table-responsive">
        <table className="table table-hover">
        <thead>
        <tr style={{ whiteSpace: "nowrap" }}>
      <th></th>
      <th scope="col" style={{ padding: "0 30px", fontSize:"15px"}}>Profile</th>
      <th
              scope="col"
              style={{
                padding: '0 30px',
                fontSize: '15px',
                position: 'relative',
              }}
            >  Employee ID{' '}
            <button className="btn btn-link btn-sm" onClick={() => handleSort('id')}>
              <i className={`bi bi-arrow-${sortConfig.column === 'id' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
            </button>
          </th>
          <th scope="col" style={{ padding: '0 30px', fontSize: '15px', position: 'relative' }}>
            Name{' '}
            <button className="btn btn-link btn-sm" onClick={() => handleSort('name')}>
              <i className={`bi bi-arrow-${sortConfig.column === 'name' && sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
            </button>
            </th>
      <th scope="col" style={{ padding: "0 30px", fontSize:"15px" }}>Department</th>
      <th scope="col" style={{ padding: "0 30px", fontSize:"15px" }}>Designation</th>
      <th scope="col" style={{ padding: "0 30px", fontSize:"15px" }}>Mobileno</th>
      <th scope="col" style={{ padding: "0 30px", fontSize:"15px" }}>Address</th>
    </tr>
        </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr
                  className={getClassForEmployee(user)}
                  key={user.id}
                >
                  <td style={{ padding: "20px 20px 10px" }}> <div><i style={{cursor:"pointer",color:"gray",fontSize:"15px"}} onClick={() => handleHide(user)} className="fa fa-ellipsis-h"></i>
                    {showActionsBox && selectedUseraction === user && (
                <div
                  ref={showActionsBoxRef}
                  style={{
                    position: "absolute",
                    backgroundClip:"padding-box",
                    borderRadius:"5%",
                    backgroundColor:"ghostwhite",
                    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
                    padding: "5px 0",
                    margin: "2px 0 0",
                    zIndex: 930,
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
                  </div></td>
                  <td style={{ padding: "10px 20px 10px" }}>
               
                  <img
                    src={`http://127.0.0.1:7000/attendance/get_file?filename=${user.name + '_' + user.id + '_' + 'profile' + '.jpg'}`}
                    className={`profile-picture ${getClassForEmployee(user)}`}
                    style={{
                      display: 'block',
                      margin: 'auto',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                    }}
                    alt="Profile Picture"
                   

                  />
                  </td>
                  <td style={{ padding: "20px 30px 10px", fontSize:"13px" }}>{user.id} </td>
                  <td style={{ padding: "20px 30px 10px", fontSize:"13px" }}>{user.name}</td>
                  <td style={{ padding: "20px 30px 10px", fontSize:"13px" }}>{user.department}</td>
                  <td style={{ padding: "20px 30px 10px", fontSize:"13px" }}>{user.designation}</td>
                  <td style={{ padding: "20px 30px 10px", fontSize:"13px" }}>{user.mobile}</td>
                  <td style={{ padding: "20px 30px 10px", fontSize:"13px" }}>{user.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          </> 
          
        </div> 
          <div className="pagination-container">
           <TablePagination
          component="div"
          count={filteredResults.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      </div>
      </body >
    );
  }
};
export default Home;