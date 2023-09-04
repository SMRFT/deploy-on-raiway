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
export default class NavbarComp extends Component {
  // Active link function to keep the navlink active when clicked
  constructor(props) {
    super(props);
    this.state = {
      isHR: true, // Set this to true if HR is logged in
    };
  }

  componentDidMount() {
    // You can call the fetchUserData function here or wherever it's needed.
    this.fetchUserData();
  }

  fetchUserData = async () => {
    const adminDetails = localStorage.getItem('adminDetails');
    if (adminDetails) {
      const { email, name, mobile, role } = JSON.parse(adminDetails);

      // Check if the role is "hr" and set isHR accordingly
      const isHR = role === 'HR';
      this.setState({ isHR });

      try {
        const response = await axios.get('http://127.0.0.1:7000/attendance/UserDetails', {
          params: { email: email }
        });
        // Handle the response and setUserData and setError as needed
      } catch (error) {
        // Handle errors and setUserData and setError as needed
      }
    }
  };
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
                  </ul>
                </div>
              </div>
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
            </Routes>
          </main>
        </div>
      </body>
    );
  }
}