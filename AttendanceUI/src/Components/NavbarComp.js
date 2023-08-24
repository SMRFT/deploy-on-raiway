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
  state = {
    activeLink: '',
  };
  handleNavItemClick = (linkName) => {
    this.setState({ activeLink: linkName });
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
            }}>
            <div className="sidebar-wrapper">
              <div className="sidebar-menu">
                <ul className="sidebar-nav">
                  <div className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="/"
                      className={`home ${this.state.activeLink === 'home' ? 'sticky' : ''}`}
                      onClick={() => this.handleNavItemClick('home')}
                    >
                      Home
                    </Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="Viewemp"
                      className={`employeedetails ${this.state.activeLink === 'employeedetails' ? 'sticky' : ''}`}
                      onClick={() => this.handleNavItemClick('employeedetails')}
                    >
                      Employee
                    </Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="Addemp"
                      className={`addemployee ${this.state.activeLink === 'addemployee' ? 'sticky' : ''}`}
                      onClick={() => this.handleNavItemClick('addemployee')}
                    >
                      Add Employee
                    </Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="Dashboard"
                      className={`dashboard ${this.state.activeLink === 'dashboard' ? 'sticky' : ''}`}
                      onClick={() => this.handleNavItemClick('dashboard')}
                    >
                      Dashboard
                    </Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="Deleteemp"
                      className={`Deleteemp ${this.state.activeLink === 'Deleteemp' ? 'sticky' : ''}`}
                      onClick={() => this.handleNavItemClick('Deleteemp')}
                    >
                      Pending Approvals
                    </Nav.Link>
                  </div>
                  <div className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="AdminReg"
                      className={`AdminReg ${this.state.activeLink === 'AdminReg' ? 'sticky' : ''}`}
                      onClick={() => this.handleNavItemClick('AdminReg')}
                    >
                      Admin
                    </Nav.Link>
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
        <Route exact path='/ViewempTable' element={<ViewempTable />} ></Route>
        <Route exact path='/Deleteemp' element={<Deleteemp/>} ></Route>
        <Route exact path='/AdminReg' element={<AdminReg/>} ></Route>
    </Routes>
    </main>
</div>
</div>
</body>
)
}
}