import React, { Component } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Header from './Header';
import Viewemp from './Viewemp';
import Addemp from './Addemp';
import Dashboard from './Dashboard';
import Summary from './Summary';
import './NavbarComp.css';
import EmployeeHours from './EmployeeHours';
import AdminReg from '../Adminreg';
import Deleteemp from './Deleteemp';
import ViewempTable from './ViewempTable';
import profile from "../images/smrft(1).png";
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';
import Event from './Event';
import EmployeeExitForm from './EmployeeExitForm';
export default class NavbarComp extends Component {
  // Active link function to keep the navlink active when clicked
  state = {
    activeLink: '',
  };
  handleNavItemClick = (linkName) => {
    this.setState({ activeLink: linkName });
  };
  constructor(props) {
    super(props);
    this.state = {
      isHR: true, // Set this to true if HR is logged in
    };
  }
  render() {
    return (
      <body>
        <Header />
        <div>
          <div className="wrapper">
            <div
              className="sidenav"
              style={{
              height: '100%',
              width: '13%',
              position: 'fixed',
              zIndex: 1,
              left: 0,
              backgroundColor: "rgb(103, 180, 204)",
              transition: '.5s ease',
              overflowX: 'hidden',
              paddingTop: '1%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              }}
            >
              <div className="sidebar-wrapper">
                <div className="sidebar-menu">
                  <ul className="sidebar-nav">
                    <div className="sidebar-nav-item">
                      <Nav.Link
                        as={Link}
                        to="/"
                        className={`home ${
                          this.state.activeLink === 'home' ? 'sticky' : ''
                        }`}
                        onClick={() => this.handleNavItemClick('home')}
                      >
                        Home
                      </Nav.Link>
                    </div>
                    <div className="sidebar-nav-item">
                      <Nav.Link
                        as={Link}
                        to="Viewemp"
                        className={`employeedetails ${
                          this.state.activeLink === 'employeedetails' ? 'sticky' : ''
                        }`}
                        onClick={() => this.handleNavItemClick('employeedetails')}
                      >
                        Employee
                      </Nav.Link>
                    </div>
                    {this.state.isHR && ( // Conditionally render HR-specific links
                      <div className="sidebar-nav-item">
                        <Nav.Link
                          as={Link}
                          to="Addemp"
                          className={`addemployee ${
                            this.state.activeLink === 'addemployee' ? 'sticky' : ''
                          }`}
                          onClick={() => this.handleNavItemClick('addemployee')}
                        >
                          Add Employee
                        </Nav.Link>
                      </div>
                    )}
                    <div className="sidebar-nav-item">
                      <Nav.Link
                        as={Link}
                        to="Dashboard"
                        className={`dashboard ${
                          this.state.activeLink === 'dashboard' ? 'sticky' : ''
                        }`}
                        onClick={() => this.handleNavItemClick('dashboard')}
                      >
                        Dashboard
                      </Nav.Link>
                    </div>
                    {this.state.isHR && ( // Conditionally render HR-specific links
                      <div className="sidebar-nav-item">
                        <Nav.Link
                          as={Link}
                          to="Deleteemp"
                          className={`Deleteemp ${
                            this.state.activeLink === 'Deleteemp' ? 'sticky' : ''
                          }`}
                          onClick={() => this.handleNavItemClick('Deleteemp')}
                        >
                          Pending Approvals
                        </Nav.Link>
                      </div>
                    )}
                    {this.state.isHR && ( // Conditionally render HR-specific links
                      <div className="sidebar-nav-item">
                        <Nav.Link
                          as={Link}
                          to="AdminReg"
                          className={`AdminReg ${
                            this.state.activeLink === 'AdminReg' ? 'sticky' : ''
                          }`}
                          onClick={() => this.handleNavItemClick('AdminReg')}
                        >
                          Admin
                        </Nav.Link>
                      </div>
                    )}
                    <div className="sidebar-nav-item">
                      <Nav.Link
                        as={Link}
                        to="Event" // Define the route for the Event page
                        className={`Event ${
                          this.state.activeLink === 'Event' ? 'sticky' : ''
                        }`}
                        onClick={() => this.handleNavItemClick('Event')}
                      >
                        Event
                      </Nav.Link>
                    </div>
                     <div className="sidebar-nav-item">
                      <Nav.Link
                        as={Link}
                        to="EmployeeExitForm"
                        className={`EmployeeExitForm ${
                          this.state.activeLink === 'EmployeeExitForm' ? 'sticky' : ''
                        }`}
                        onClick={() => this.handleNavItemClick('EmployeeExitForm')}
                      >
                        Employee Exit Form
                      </Nav.Link>
                    </div>
                   </ul>
                </div>
              </div>
              {/* <div style={{marginLeft:"-70%",marginTop:"70%"}}>
              <Nav.Link as={Link} to="EmployeeExitForm" >
              <i style={{ fontSize: "250%", color: "white", cursor:"pointer" }}
                className="bi bi-person"
                title="Employee Exit Form"
              ></i></Nav.Link></div> */}
            </div>
          </div>
          <main>
            <Routes>
              <Route exact path="/Viewemp" element={<Viewemp />} />
              <Route exact path="/Addemp" element={<Addemp />} />
              <Route exact path="/Dashboard" element={<Dashboard />} />
              <Route exact path="/Summary" element={<Summary />} />
              <Route exact path="/EmployeeHours" element={<EmployeeHours />} />
              <Route exact path="/ViewempTable" element={<ViewempTable />} />
              <Route exact path="/Deleteemp" element={<Deleteemp />} />
              <Route exact path="/AdminReg" element={<AdminReg />} />
              <Route exact path="/ForgetPassword" element={<ForgetPassword />} />
              <Route exact path="/ResetPassword" element={<ResetPassword />} />
              <Route exact path="/Event" element={<Event/>} />
              <Route exact path="/EmployeeExitForm" element={<EmployeeExitForm />} />
            </Routes>
          </main>
        </div>
      </body>
    );
  }
}