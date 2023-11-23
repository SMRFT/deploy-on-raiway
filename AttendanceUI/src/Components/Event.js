import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize'
import './Event.css';
function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [joiningAnniversaries, setJoiningAnniversaries] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState({ blogs: [] });
  const { width, height } = useWindowSize();
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });
  const slideInFromLeft = useSpring({
    transform: 'translateX(0%)',
    from: { transform: 'translateX(-100%)' },
    config: { duration: 1000 },
  });

  useEffect(() => {
    fetch('http://127.0.0.1:7000/attendance/showemp')
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

  useEffect(() => {
    fetch('http://127.0.0.1:7000/attendance/employee_events/')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setBirthdays(data.birthdays);
          setJoiningAnniversaries(data.joining_anniversaries);
        } else {
          console.error('Empty response from the server.');
        }
      })
      .catch((error) => {
        console.error('Error fetching employee events:', error);
      });
  }, []);

  return (
    <animated.div style={fadeIn} className="event-container">
      <br />
      <animated.div style={{ ...slideInFromLeft, fontSize: '200%', fontFamily: 'serif' }}>
        Today's Employee Events
      </animated.div>

      {/* Birthday Container */}
      <div className="birthday-container">
        <animated.h2 style={{ ...fadeIn, fontSize: '150%', fontFamily: 'serif' }}>
          Today's Birthdays
        </animated.h2>
        <ul>
          {birthdays.map((employee, index) => {
            const [name, id] = employee.split('_');
            return (
              <animated.div key={index} style={fadeIn} className="event-item">
                <div>
                  <animated.img
                    src={`http://127.0.0.1:7000/attendance/get_file?filename=${name + '_' + id + '_' + 'profile' + '.jpg'}`}
                    className="profile-image"
                    alt="Profile Picture"
                  />
                </div>
                <animated.div key={index}>{employee}</animated.div>
              </animated.div>
            );
          })}
        </ul>
      </div>

      {/* Anniversary Container */}
      <div className="anniversary-container">
        <animated.h2 style={{ ...fadeIn, fontSize: '150%', fontFamily: 'serif' }}>
          Work Anniversaries
        </animated.h2>
        <ul>
          {joiningAnniversaries.map((employee, index) => (
            <animated.li key={index} style={fadeIn} className="event-item">
              {employee.name} is celebrating {employee.anniversary} years of joining
            </animated.li>
          ))}
        </ul>
      </div>

      <Confetti width={width} height={height} />
    </animated.div>
  );
}

export default App;