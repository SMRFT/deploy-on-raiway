import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart1 from "react-apexcharts";



function ApexChart() {
const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Deleted Employees",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 300,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "13%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [],
        title: {
          text: "Month",
        },
        style: {
          fontFamily:' Helvetica, Arial, sans-serif',
          fontSize: "20px",
        },
      },
      yaxis: {
        title: {
          text: "Employees Realiving",
        },
        style: {
          fontFamily:' Helvetica, Arial, sans-serif',
          fontSize: "14px",
        },
      },
      fill: {
        opacity: 5,
      },
    },
  });
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  useEffect(() => {
    axios
      .get("http://127.0.0.1:7000/attendance/deleted-employees/")
      .then((res) => {
        const employees = res.data;
        const currentYear = new Date().getFullYear();
  
        const uniqueYears = [...new Set(employees.map((employee) => new Date(employee.deleted_at).getFullYear()))];
        setYears(uniqueYears);
  
        const employeeCounts = Array.from({ length: 12 }, () => ({ count: 0, names: [] }));
        employees.forEach((employee) => {
          const date = new Date(employee.deleted_at);
          if (date.getFullYear() === selectedYear) {
            const monthIndex = date.getMonth();
            employeeCounts[monthIndex].count++;
            employeeCounts[monthIndex].names.push(employee.name);
          }
        });
  
        const monthsWithData = employeeCounts
          .map((entry, index) => ({ name: monthOrder[index], hasData: entry.count > 0 }));
  
        const availableMonths = monthsWithData
          .filter((month) => month.hasData)
          .map((month) => month.name);
  
        const monthCounts = employeeCounts
          .filter((entry, index) => monthsWithData[index].hasData)
          .map((entry) => entry.count);
  
        setChartOptions((prevState) => ({
          ...prevState,
          series: [
            {
              name: "Deleted Employees",
              data: monthCounts,
            },
          ],
          options: {
            ...prevState.options,
            xaxis: {
              categories: availableMonths,
              title: {
                text: "Month",
              },
              labels: {
                style: {
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "14px",
                },
              },
            },
            // ... (rest of the options)
          },
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedYear]);
  
  
  return (
    <div
      className="col-sm-6"
      style={{
        backgroundColor: "#F6F8FA",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        justifyContent: "center",
        position: "relative",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontSize: "100%",
          fontFamily: " Helvetica, Arial, sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        <br />Employees Relieved
      </div>
      <br />
      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <Chart1 options={chartOptions.options} series={chartOptions.series} type="bar" height={300} width={800} />
    </div>
  );
}

export default ApexChart;




