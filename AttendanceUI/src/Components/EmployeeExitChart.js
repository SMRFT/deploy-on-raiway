import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import Myconstants from "./Myconstants";

function EmployeeExitChart() {
  const [employeeData, setEmployeeData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExitStatus, setSelectedExitStatus] = useState("Voluntary"); // Default to "Voluntary"
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); // Default to the current year

  // Fetch employee data, including exit status
  useEffect(() => {
    axios
      .get("http://127.0.0.1:7000/attendance/get-employee-exit-form/")
      .then((response) => {
        const responseData = response.data.data;

        setEmployeeData(responseData);

        setLoading(false); // Set loading to false when data is available
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Filter the data based on the selected exit status and year
    const filteredData = employeeData.filter(
      (employee) =>
        employee.exitStatus.toLowerCase() === selectedExitStatus.toLowerCase() &&
        (!selectedYear || new Date(employee.lastWorkingDate).getFullYear() === Number(selectedYear))
    );

    // Initialize an array to store monthly counts
    const monthlyCounts = Array(12).fill(0);

    // Count employees for each month
    filteredData.forEach((employee) => {
      const exitDate = new Date(employee.lastWorkingDate);
      const month = exitDate.getMonth();
      monthlyCounts[month] += 1;
    });

    // Prepare the data for the chart
    const chartData = [
      {
        name: selectedExitStatus,
        data: monthlyCounts,
      },
    ];

    setChartData(chartData);
  }, [selectedExitStatus, selectedYear, employeeData]);

  const chartOptions = {
    chart: {
      id: "employee-status-chart",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '80%',
      },
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      title: {
        text: 'Month',
        style: {
          fontFamily: 'serif',
          fontSize: '16px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Employees',
        style: {
          fontFamily: 'serif',
          fontSize: '16px',
        },
      },
      labels: {
        formatter: function (value) {
          return Math.floor(value); // This will display integer values
        },
      },
      max: 10, // Set the maximum y-axis value
    },

  };

  // Get distinct years from the data
  const distinctYears = [...new Set(employeeData.map((employee) => new Date(employee.lastWorkingDate).getFullYear()))];

  return (
    <div style={{ marginLeft: "5%", height: 600, width: 520, backgroundColor: "#F6F8FA", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", justifyContent: "center", position: "relative", display: "flex", alignItems: "center", flexDirection: "column" }}>
       <div style={{fontSize: "100%",fontFamily: "serif",whiteSpace: "nowrap"}}>
          Employee Exit Details Chart
       </div><br/>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "20px"}}>
          <label style={{fontFamily:"serif"}}>Select Exit Status</label>&nbsp;
          <select style={{fontFamily:"serif",textAlign:"center"}} onChange={(e) => setSelectedExitStatus(e.target.value)}>
            {Myconstants.employeeexitstatus.map((exit, index) => (
              <option style={{fontFamily:"serif"}} key={index} value={exit}>
                {exit}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{fontFamily:"serif"}}>Select Year </label>&nbsp;
          <select style={{fontFamily:"serif"}} onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
            <option style={{fontFamily:"serif",textAlign:"center"}} value={new Date().getFullYear().toString()}>Current Year</option>
            {distinctYears.map((year) => (
              <option style={{fontFamily:"serif",textAlign:"center"}} key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <Chart options={chartOptions} series={chartData} type="bar" width="500" height={400}/>
      )}
    </div>
  );
}

export default EmployeeExitChart;
