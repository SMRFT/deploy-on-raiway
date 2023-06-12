import "./App.css";
import profile from "./images/smrft.png";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import profile1 from "./images/smrft(1).png";
// import "./Logo.css";
function App() {
  //Functions to navigate to different pages
  const navigate = useNavigate();
  const navigateToAdmin = () => {
    navigate("/adminlogin");
  };
  const navigateToLogin = () => {
    navigate("/WebcamCaptureLogin");
  };
  const navigateToLogout = () => {
    navigate("/WebcamCaptureLogout");
  };
  const navigateToBreak = () => {
    navigate("/Break");
  };
  return (
    <div className="row">
      <div className="col-sm-3">
        <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
        <header>
        <div className='main'></div>
        <div className='logo'>
          <img src={profile} className="smrft_logo" alt="logo" />
        </div>
        </header>
      </div>
      <br />
      <div body>
      <div className="row">
          <div class="col-sm-3">
            <button className="landingPageButtons" onClick={navigateToAdmin}>
              <h1><b>Admin</b></h1>
            </button>
          </div>
          <div class="col-sm-3">
            <button className="landingPageButtons" onClick={navigateToLogin}>
              <h1><b>Login</b></h1>
            </button>
          </div>
          <div class="col-sm-3">
            <button className="landingPageButtons" onClick={navigateToLogout}>
              <h1><b>Logout</b></h1>
            </button>
          </div>
          <div class="col-sm-3">
            <button className="landingPageButtons" onClick={navigateToBreak}>
              <h1><b>Break</b></h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;