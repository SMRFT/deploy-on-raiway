import React, { useEffect, useState } from 'react';
import * as ReactBootStrap from "react-bootstrap";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "../Admin";
import "./NavbarComp.css"
import { Table } from 'react-bootstrap'
import { CSVLink } from 'react-csv';
import profile from "../images/smrft.png";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import Viewemp from "./Viewemp";
import "../Components/AdminCalendar.css";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import Fade from '@material-ui/core/Fade';
import "./NavbarComp.css";

function Admincalendar() {
  //Getting id and name from another file using params
  const params = useParams();
  const name = params.name;
  const sub = name.split('_');
  const id = sub[1]
  const name1 = sub[0]
  console.log(name1)
  let image = ''

  let [summarydata, setSummaryData] = useState([
    { workingdays: ' ', leavedays: ' ', overtime: ' ' }
]);

  const [show, setShow] = useState(false);
  const [Otbox, setOtbox] = useState(false);
  const [leavebox, setLeavebox] = useState(false);
  // let [currentMonthPayload, setCurrentMonthPayload] = useState("");
  let [prevMonthPayload, setPrevMonthPayload] = useState("");
  let [nextMonthPayload, setNextMonthPayload] = useState("");
  let [overtimeDates, setOvertimeDates] = useState("");
  let [overtimehours, setOvertimehours] = useState([]);
  let [workedhours, setWorkedhours] = useState([]);
  let [leavedates, setLeaveDates] = useState("");
  const [userdata, setUserdata] = useState([]);
  let [calendarData, setCalendarData] = useState([]);
  let [eventDates, setEventDates] = useState([]);
  let [sundayDates, setSundayDates] = useState([]);
  let[summarydetails,setSummarydetails]=useState([]);

  //Onclick functions for summary modal
  const handleOpen = () => {
    setShow(true);
  }
  const handleClose = () => setShow(false);
  const handleOtDialog = () => setOtbox(false);
  const handleleaveDialog = () => setLeavebox(false);
  useEffect(() => {
    handleOpen();
    handleClose();
    handleOtDialog();
    handleleaveDialog();
  }, []);

    //Timesheet function (Inbuilt)
    const timesheetRef = React.createRef();
    function timesheet() {
      return timesheetRef.current.control;
    }

  //Calendar inbuilt parameters and should be mentioned in the Daypilot component to perform this actions
  let events = {
    locale: "en-us",
    onBeforeRowHeaderRender: (args) => {
      args.row.horizontalAlignment = "center";
    },
    onBeforeCellRender: (args) => {
      if (args.cell.start.getDayOfWeek() === 0) { // Sunday
        if (eventDates.includes(args.cell.start.toString("yyyy-MM-dd"))) {
          args.cell.disabled = false;
          args.cell.cssClass = ""; // remove the "disabled-cell" class
        } else {
          args.cell.disabled = true;
          args.cell.cssClass = "disabled-cell";
          sundayDates.push(args.cell.start.toString("yyyy-MM-dd"));
        }
      }
    },
    

    onTimeRangeSelected: async (args) => {
      const dp = args.control;

     // Check if there's an existing event for the user on the selected day
  const existingEvent = dp.events.list.some(event => {
    return event.resource === args.resource && new DayPilot.Date(event.start).getDatePart() === new DayPilot.Date(args.start).getDatePart();
  });

  // If there's an existing event, do not show the modal
  if (existingEvent) {
    dp.clearSelection();
    return;
  }
      const form = [
        { name: "LeaveType", id: "leaveType", options: [{ name: "SL", id: "SL" }, { name: "CL", id: "CL" },] }

      ];
      const modal = await DayPilot.Modal.form(form);
      const leaveType = { leavetype: String(Object.values(modal.result)) };
      console.log("date1",args.end.value)
      console.log("starttime:",args.start)
      console.log("endtime:",args.end)
      let datetime = args.end.value;
      let dateObj = new Date(datetime);
      let year = dateObj.getFullYear();
      console.log("year:",year);
      const [date, time] = datetime.split('T');
      console.log("date",date);
      let iddate = id + date;
      let start =args.start;
      let end =args.end;
      const today = DayPilot.Date.today()
      const month = today.getMonth()+1;
      let shift="None";
      let day = dateObj.getDay();
      let latelogin = "00:00:00";
      let earlyLogout = "00:00:00";
      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        resource: args.resource,
        text: Object.values(modal.result)
      });
      try {
        const response = await fetch('http://127.0.0.1:7000/attendance/admincalendarlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...leaveType,id:id,date:date,name:name1,month:month,year:year,start:start,
          end:end,iddate:iddate,shift:shift,day:day,latelogin:latelogin,earlyLogout:earlyLogout})
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
    crosshairType: "Header",
    timeHeaders: [{ "groupBy": "Hour" }, { "groupBy": "Cell", "format": "mm" }],
    scale: "CellDuration",
    cellDuration: 30,
    viewType: "Days",
    showNonBusiness: true,
    businessWeekends: false,
    floatingEvents: true,
    eventHeight: 30,
    groupConcurrentEvents: false,
    eventStackingLineHeight: 100,
    allowEventOverlap: true,
    allowAllEvent: true,
    timeRangeSelectedHandling: "Enabled",
  }

// Function to fetch the event data (working days) for the current month (as displayed on the timesheet calendar)
async function fetchCalendarData() {
  const today = DayPilot.Date.today();
  const month = today.getMonth() + 1;
  const year = today.getYear();
  const currentMonthPayload = {
    id: id,
    month: month,
    year: year
  };
  const { data: calendarData } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/EmpcalendarId", currentMonthPayload);
  const eventDatesArr = calendarData.map(item => item.date);
  setEventDates(eventDatesArr);
  setCalendarData(calendarData);
  // Update the timesheet calendar with the fetched data
  timesheet().update({
    startDate: today.firstDayOfMonth(),
    days: today.daysInMonth(),
    events: calendarData
  });
  // Fetch the user data for the current month
  getuserdata(month, year);
  summaryUserData(month,year);
}

// Call fetchCalendarData when the component mounts
useEffect(() => {
  fetchCalendarData();
}, []);

  // Function to get the user data (export details) for a specific month and year
  const getuserdata = async (month, year) => {
    try {
      const response = await fetch("http://127.0.0.1:7000/attendance/EmployeeExport", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          month: month,
          year: year
        }),
      });
      const data = await response.json();
      setUserdata(data);
      console.log('User Data:', userdata);
    } catch (error) {
      // handle error
    }
  };
  //summary export for singleEmpolyee calculations
  const summaryUserData = async (month, year) => {
    try {
      const response = await fetch("http://127.0.0.1:7000/attendance/EmployeeSummaryExport", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: month,
          year: year
        }),
      });
      const data = await response.json();
  
      setSummarydetails(data);
      console.log("Summarydetails:", data);
    } catch (error) {
      // handle error
    }
  };
  
   // Function to handle the "previous" button click
  // Fetches the event data (working days) and user data for the previous month, and updates the timesheet calendar and user data accordingly
  async function previous() {
    const currentmonthstartdate = timesheet().visibleStart();
    const prevmonthstartdate = currentmonthstartdate.addMonths(-1);
    const prevMonth = prevmonthstartdate.getMonth() + 1;
    const prevMonthYear = prevmonthstartdate.getYear();
    prevMonthPayload = {
      id: id,
      month: prevMonth,
      year: prevMonthYear
    };
    const { data: calendarData } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/EmpcalendarId", prevMonthPayload);
    timesheet().update({
      startDate: prevmonthstartdate,
      days: prevmonthstartdate.daysInMonth(),
      events: calendarData
    });
    // Fetch the user data for the previous month
    getuserdata(prevMonth, prevMonthYear);
    summaryUserData(prevMonth, prevMonthYear);
  }
  // Function to handle the "next" button click
  // Fetches the event data (working days) and user data for the next month, and updates the timesheet calendar and user data accordingly
  async function next() {
    const currentmonthstartdate = timesheet().visibleStart();
    const nextmonthstartdate = currentmonthstartdate.addMonths(1);
    const nextMonth = nextmonthstartdate.getMonth() + 1;
    const nextMonthYear = nextmonthstartdate.getYear();
    nextMonthPayload = {
      id: id,
      month: nextMonth,
      year: nextMonthYear
    };
    const { data: calendarData } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/EmpcalendarId", nextMonthPayload);
    timesheet().update({
      startDate: nextmonthstartdate,
      days: nextmonthstartdate.daysInMonth(),
      events: calendarData
    });
    // Fetch the user data for the next month
    getuserdata(nextMonth, nextMonthYear);
    summaryUserData(nextMonth, nextMonthYear);
  }
 ////retrive image of an employee
 image = "http://localhost:7000/media/my_Employee/picture/" + name1 + "_"+ id + ".jpg"
 console.log('5' - - '2');

  return (
    <div>
      <div>
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
              <div className="nav_link1" style={{ color: "green", fontFamily: "cursive",marginTop:"17%" }}>Home</div></Nav.Link>
              <Nav.Link as={Link} to="/Admin/Viewemp">
              <div  className="nav_link2"style={{ color: "green", fontFamily: "cursive",marginTop:"9%"}}>Employee Details</div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="page-heading">
      <center><h4><em>Summary Of Employee</em></h4></center>

      </div>
      <div className="profile">
    <div className="name">{name1}</div>
    <img
        src={`http://127.0.0.1:7000/attendance/get_file?filename=${name1 + '_' + id+"_"+"profile"+".jpg"}`}
        className="center"
        alt="profile"
        style={{ maxWidth: '120px', maxHeight: '100px' }}
    />
</div>

      <br />
      <br />
   <div className="col-sm-12" style={{ marginTop: '0.5px' }}>
  <div className="row">
    <div className="col d-flex align-items-center">
      <button className="btn btn-primary previous" type="button" onClick={ev => previous()}>Previous</button>
      <button className="btn btn-primary next ml-2" type="button" onClick={ev => next()}>Next</button>
    </div>
    <div className="col d-flex justify-content-end align-items-center">
      <div className="csv ml-auto">
        <i>
          <CSVLink
            className="fa fa-download"
            data={userdata}
            filename={name}
            title="Download CSV"
          ></CSVLink>
        </i>
      </div>
    </div>
  </div>
</div>
      <div className='AdminCalendar'>
        <DayPilotScheduler
          {...events}
          ref={timesheetRef}
          className='DayPilotSchedulerCustom'
        />
      </div>
      <div>
  <br/>
  <center>
  {summarydetails.map((data) => {
    // Specify the ID for which you want to display the attendance report
    const targetId = id;
    // Display the attendance report only for the specified ID
    if (data.id === targetId) {
      return (
        <div>
  {/* <div className="divider" ></div> */}
    <span>
      Payable Days: 
      {data.payable_days} Day(s)
    </span>
    <div className="divider" style={{ backgroundColor: 'red' , height: '50px'}}></div>

    <span>
      Present Day(s): {data.workingdays} Day(s)
    </span>
    <div className="divider" style={{ backgroundColor: 'red', height: '50px' }}></div>
    <span>
      OverTime: {data.overtimedays} Day(s)
    </span>
    <div className="divider" style={{ backgroundColor: 'red', height: '50px' }}></div>
    <span>
      Paid Leave: {data.paid_leave_days} Day(s)
    </span>
    <div className="divider" style={{ backgroundColor: 'red' , height: '50px'}}></div>
    <span>
      Loss of Pay: {data.loss_of_pay}Day(s)
    </span>
    <div className="divider" style={{ backgroundColor: 'red', height: '50px' }}></div>
    <span>
      Weekend: {data.total_weekoff} Day(s)
    </span>
  </div>
    );
    }
    return null; // Skip rendering for other IDs
  })}
</center>


</div>




</div>
  )
}
export default Admincalendar;