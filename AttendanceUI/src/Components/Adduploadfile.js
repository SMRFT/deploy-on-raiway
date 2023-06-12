import { useState, useEffect } from 'react';

const YourComponent = () => {
  const [myDay, setMyDay] = useState(new Date());
  const [userexportdata, setExportdata] = useState([]);
  const [myMonth, setMyMonth] = useState(new Date());
  const [myYear, setMyYear] = useState(new Date());
  const newDate = new Date();
  const minDate = new Date(myYear.getFullYear(), myMonth.getMonth(), 1);
  const maxDate = new Date(myYear.getFullYear(), myMonth.getMonth() + 1, 0);
  useEffect(() => {
    const getexportdata = async () => {
      fetch("https://smrftadmin.onrender.com/attendance/EmployeeSummaryExport", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: myDay.getMonth() + 1,
          year: myDay.getFullYear(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setExportdata(data);
          console.log(userexportdata);
        });
    };
    getexportdata();
  }, [myDay]);

  useEffect(() => {
    setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
  }, [myMonth, myYear, setMyDay]);

  const renderExportContents = (day, date) => {
    if (date < minDate || date > maxDate) {
      return <span></span>;
    }
    return <span>{date.getDate()}</span>;
  };


  
};

export default YourComponent;