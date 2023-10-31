import React, { useState, useEffect } from 'react';
import './Event.css';

function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [joiningAnniversaries, setJoiningAnniversaries] = useState([]);
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

    const [name,setName] = useState('')
    const [id,setId] = useState('')


  useEffect(() => {
    // Fetch employee events data from Django backend
    fetch('http://127.0.0.1:7000/attendance/employee_events/')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setBirthdays(data.birthdays);
          setJoiningAnniversaries(data.joining_anniversaries);
          const splitBirthdays = data.birthdays.map((str) => {
            const [name, id] = str.split('_');
            setName(name)
            setId(id)

            console.log("###",name,id)
            return { name, id };
          });
        } else {
          console.error('Empty response from the server.');
        }
      })
      .catch((error) => {
        console.error('Error fetching employee events:', error);
      });
  }, []);

 
  
  return (
    <div className="event-birthday">
      <br/>
      <div style={{fontSize:"200%",fontFamily:"serif"}}>Today's Employee Events</div>
      <div><br/>
        <h2 style={{fontSize:"150%",fontFamily:"serif"}}>Today's Birthdays</h2>
        <ul>
          {birthdays.map((employee, index) => (
            <div>
              <div>
              <img
                src={`http://127.0.0.1:7000/attendance/get_file?filename=${name + '_' + id + '_' + 'profile' + '.jpg'}`}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  marginTop:'-10%'
                }}
                alt="Profile Picture"
              />
              </div>
            <div key={index}>{employee}</div>
            </div>

          ))}
        </ul>
      </div>
      <div>
        <h2 style={{fontSize:"150%",fontFamily:"serif"}}>Work Anniversaries</h2>
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