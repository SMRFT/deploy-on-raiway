import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

function ApexChart() {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Fetch joined employees data
    axios
      .get('http://127.0.0.1:7000/attendance/showemp')
      .then((res) => {
        const data = res.data;
        const employees = {};
        data.forEach((employee) => {
          const addedDate = new Date(employee.dateofjoining);
          const month = addedDate.toLocaleString('default', { month: 'long' });
          if (!employees[month]) {
            employees[month] = [];
          }
          employees[month].push(employee);
        });
        const employeeData = Object.keys(employees).map((month) => ({
          month,
          count: employees[month].length,
          employees: employees[month].map(emp => emp.name).join(', '),
          dateofjoining: employees[month][0].dateofjoining,
        }));
        const yearsWithData = [...new Set(employeeData.map(entry => new Date(entry.dateofjoining).getFullYear()))];
        setAvailableYears(yearsWithData);
        const filteredData = employeeData.filter((entry) => {
          const entryYear = new Date(entry.dateofjoining).getFullYear();
          return entryYear === selectedYear;
        });
        setEmployeeData(filteredData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedYear]);

  const joinedData = employeeData.map((entry) => entry.count);

  const chartOptions = {
    chart: {
      id: 'chartyear',
      type: 'bar',
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '80%',
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    series: [
      {
        name: 'Joined Employees',
        style: {
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '14px',
        },
        data: joinedData,
      },
    ],
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
      max: 10,
    },
    tooltip: {
      y: {
        formatter: (value) => value + ' employees',
      },
      x: {
        formatter: (value) => value,
      },
      marker: {
        show: false,
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const joinedCount = joinedData[dataPointIndex];
        return `<div class="apexcharts-tooltip-custom">
          <div class="employee-count">${joinedCount} joined</div>
        </div>`;
      },
    },
  };

  return (
    <div style={{height: 600, width: 600, backgroundColor: "#F6F8FA",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",justifyContent: "center",position: "relative",display: "flex",alignItems: "center",flexDirection: "column" }}><br/>
      <div style={{fontSize: "100%",fontFamily: "serif",whiteSpace: "nowrap",justifyContent: "center",display: "flex",alignItems: "center",}}>
        <br/>Employees Joined
      </div><br/>
      <div>
      <label style={{fontFamily:"serif"}}>Select Year</label>&nbsp;
      <select style={{fontFamily:"serif"}} value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
        {availableYears.map((year) => (
          <option style={{fontFamily:"serif",textAlign:"center"}} key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      </div>
      {employeeData.length > 0 && (
        <ReactApexChart options={chartOptions} series={chartOptions.series} type="bar" height={400} width={600} />
      )}
    </div>
  );
}

export default ApexChart;