import React, { useState, useEffect } from 'react';
import './Event.css';

function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [joiningAnniversaries, setJoiningAnniversaries] = useState([]);

  useEffect(() => {
    // Fetch employee events data from Django backend
    fetch('http://127.0.0.1:7000/attendance/employee_events/')
      .then((response) => response.json())
      .then((data) => {
        setBirthdays(data.birthdays);
        setJoiningAnniversaries(data.joining_anniversaries);
      })
      .catch((error) => {
        console.error('Error fetching employee events:', error);
      });
  }, []);

  return (
    <div className="event-birthday">
      Today's Employee Events
      <div>
        <h2>Birthday Celebrations:</h2>
        <ul>
          {birthdays.map((employee, index) => (
            <li key={index}>{employee}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Joining Anniversaries:</h2>
        <ul>
          {joiningAnniversaries.map((employee, index) => (
            <li key={index}>
              {employee.name} is celebrating {employee.anniversary} years of joining
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;