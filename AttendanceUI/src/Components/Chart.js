import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

function ApexChart() {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
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

  // const selectedYearData = employeeData.filter(entry => new Date(entry.dateofjoining).getFullYear() === selectedYear);


    
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
            endingShape: "rounded",
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
            name: 'Employees',
            style: {
              fontFamily:' Helvetica, Arial, sans-serif',
              fontSize: "14px",
            },
            data: employeeData.map((e) => e.count),
          },
        ],
        xaxis: {
          categories: employeeData.map((e) => e.month),
          title: {
            text: 'Month',
            style: {
              fontFamily:' Helvetica, Arial, sans-serif',
              fontSize: "14px",
            },
            
          },
        },
        yaxis: {
          title: {
            text: 'Employees',
            style: {
              fontFamily:' Helvetica, Arial, sans-serif',
              fontSize: "14px",
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
            const employeeCount = employeeData[dataPointIndex].count;
            const employeeNames = employeeData[dataPointIndex].employees;
            return `<div class="apexcharts-tooltip-custom">
              <div class="employee-count">${employeeCount} employees</div>
              <div class="employee-names">${employeeNames}</div>
            </div>`;
          },
        },
      };
      const chart = new ApexCharts(document.querySelector('#chart'), chartOptions);
      chart.render();
 

  return (
    <div style={{ backgroundColor: "#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent: "center", position: "relative", display: "flex", alignItems: "center", flexDirection: "column" }}>
    <div style={{ fontSize: "100%", fontFamily: " Helvetica, Arial, sans-serif", whiteSpace: "nowrap" }}>
      <br />Employees Joined
    </div>
    <br />
    <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
      {availableYears.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>

    {employeeData.length > 0 && (
      <ReactApexChart options={chartOptions} series={[{ data: employeeData.map((e) => e.count) }]} type="bar" height={300}width={800} />
    )}
  </div>
  );
}

export default ApexChart;