import "../Components/Break.css";
import profile from "../images/smrft.png";
import NavbarComp from "../Components/NavbarComp";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
function Break() {
    const navigate = useNavigate();
    const navigateToBreakstart = () => {
        navigate("/Breakstart");
    };
    const navigateToBreakend = () => {
        navigate("/Breakend");
    };
    return (
        <div className="row">
            <div className="col-lg-12">
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
            <br />

            <div body>
            <div className="row">
                <div class="col-sm-4">
                    <button className="BreakButton" onClick={navigateToBreakstart}>
                        <b>Break Out</b>
                    </button>
                </div>
            <div class="col-sm-4">
                <button className="BreakButton" onClick={navigateToBreakend}>
                    <b>Break In</b>
                </button>
            </div>
            </div>
            </div>
        </div>
    );
}
export default Break;