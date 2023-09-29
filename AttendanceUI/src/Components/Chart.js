import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { Bar } from "react-chartjs-2";

function ApexChart() {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [relievedData, setRelievedData] = useState([]);

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

    // Fetch relieved employees data
    axios
      .get('http://127.0.0.1:7000/attendance/deleted-employees/')
      .then((res) => {
        setRelievedData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedYear]);

  // Define the monthOrder array
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Merge the data for joined and relieved employees by month
  const combinedData = employeeData.map((joinedEntry) => {
    const month = joinedEntry.month;
    const joinedCount = joinedEntry.count;
    const relievedEntry = relievedData.find((relieved) => {
      const date = new Date(relieved.deleted_at);
      return date.getMonth() === monthOrder.indexOf(month) && date.getFullYear() === selectedYear;
    });
    const relievedCount = relievedEntry ? 1 : 0;
    return {
      month,
      joinedCount,
      relievedCount,
    };
  });

  const chartOptions = {
    chart: {
      id: 'chartyear',
      type: 'bar',
      height: 300,
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
        columnWidth: '20%',
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
        data: combinedData.map((entry) => entry.joinedCount),
      },
      {
        name: 'Relieved Employees',
        style: {
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '14px',
        },
        data: combinedData.map((entry) => entry.relievedCount),
      },
    ],
    xaxis: {
      type: "category",
      categories: combinedData.map((entry) => entry.month),
      title: {
        text: 'Month',
        style: {
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '14px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Employees',
        style: {
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '14px',
        },
      },
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
        const joinedCount = combinedData[dataPointIndex].joinedCount;
        const relievedCount = combinedData[dataPointIndex].relievedCount;
        return `<div class="apexcharts-tooltip-custom">
          <div class="employee-count">${joinedCount} joined, ${relievedCount} relieved</div>
        </div>`;
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#F6F8FA', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent: 'center', position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ fontSize: '100%', fontFamily: 'Helvetica, Arial, sans-serif', whiteSpace: 'nowrap' }}>
        <br />Employees Joined and Relieved
      </div>
      <br />
      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {combinedData.length > 0 && (
        <ReactApexChart options={chartOptions} series={chartOptions.series} type="bar" height={300} width={1000} />
      )}
    </div>
  );
}

export default ApexChart;
