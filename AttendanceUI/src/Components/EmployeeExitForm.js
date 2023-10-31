import React, { useState } from 'react';
import Myconstants from './Myconstants';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeExitForm.css';

function EmployeeExitForm() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [department, setDepartment] = useState('');
  const [exitStatus, setExitStatus] = useState('');
  const [lastWorkingDate, setLastWorkingDate] = useState(null);

  const handleExitStatusChange = (e) => {
    setExitStatus(e.target.value);
  };

  const handleDateChange = (date) => {
    setLastWorkingDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Create a JavaScript object to hold the form data
    const formData = {
      name,
      id,
      department,
      exitStatus,
      lastWorkingDate,
    };
  
    fetch('http://127.0.0.1:7000/attendance/submit-employee-exit-form/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Form submitted successfully');
        } else {
          console.error('Form submission failed');
        }
      })
      .catch((error) => {
        // Handle any network or other errors
        console.error('An error occurred:', error);
      });
  };  

  return (
    <body className='employeeexitform'>
      <br/>
      <center><div style={{fontSize:"150%",fontFamily:"serif",whiteSpace:"nowrap"}}>Employee Exit Details</div></center>
      <br/>
    <Form className='exitform' onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label className="custom-label" >Name</Form.Label>
        <Form.Control
          className="custom-control"
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="id">
        <Form.Label className="custom-label">ID</Form.Label>
        <Form.Control
          className="custom-control"
          type="text"
          placeholder="Enter ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="department">
          <Form.Label className="custom-label">Department</Form.Label>
          <Form.Select 
            className="custom-control"
            as="select"
            value={department} 
            onChange={(e) => setDepartment(e.target.value)} 
          >
            <option value="" style={{fontFamily:"serif"}}>Select Department</option>
            {Myconstants.departments.map((dept, index) => (
              <option style={{fontFamily:"serif"}} key={index} value={dept}>
                {dept}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      <Form.Group className="mb-3" controlId="employeeStatus">
      <Form.Label className="custom-label">Employee Exit Status</Form.Label>
        <Form.Select value={exitStatus} onChange={handleExitStatusChange} className="custom-control">
          <option value="" style={{fontFamily:"serif"}}>Select Employee Exit Status</option>
          {Myconstants.employeeexitstatus.map((exit, index) => (
              <option style={{fontFamily:"serif"}} key={index} value={exit}>
                {exit}
              </option>
            ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="nextDate">
        <Form.Label className="custom-label">Last Working Date</Form.Label>
        <DatePicker
          className="custom-control"
          selected={lastWorkingDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText='Select Date'
        />
      </Form.Group>
      <Button variant="primary" type="submit" className='exit-button'>Submit</Button>
    </Form>
    </body>
  );
}
export default EmployeeExitForm;