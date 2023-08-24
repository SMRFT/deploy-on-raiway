import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const fetchData = async (month) => {
  const response = await fetch("http://127.0.0.1:7000/attendance/EmployeeSummaryExport", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      month: month,
      year: currentYear,
    }),
  });
  const result = await response.json();
  return result;
};

const BarChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    const fetchDataForAllMonths = async () => {
      const seriesData = [];
      for (let i = 1; i <= 12; i++) {
        const result = await fetchData(i);
        const slTakenByUser = result.reduce((acc, user) => {
          return acc + user.SL_Taken;
        }, 0);
        const totalUsers = result.length;
        const slTakenPercentage = totalUsers !== 0 ? ((slTakenByUser / (totalUsers * 12)) * 100).toFixed(1) : 0;
// Round to 1 decimal place
        console.log(totalUsers)
        seriesData.push(parseFloat(slTakenPercentage)); // Convert to a float if needed
      }
      setChartData({
        series: [
          {
            name: "SL Taken Percentage",
            data: seriesData,
          },
        ],
        options: {
          chart: {
            type: "bar",
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              dataLabels: {
                position: "top",
              },
            },
          },
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#304758"],
            },
          },
          xaxis: {
            categories: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            position: "bottom",
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            crosshairs: {
              fill: {
                type: "gradient",
                gradient: {
                  colorFrom: "#D8E3F0",
                  colorTo: "#BED1E6",
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                },
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          yaxis: {
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              formatter: function (val) {
                return val + "%";
              },
            },
          },
          title: {
            text: "Sick Leave",
            floating: false,
            offsetY: 10, // Adjust this value to position the title at the top
            align: "center", // Adjust alignment as needed
            style: {
              color: "#444",
              fontFamily:' Helvetica, Arial, sans-serif',
              fontSize: "14px", // You can adjust the font size if needed
            },
          },
        },
      });
    };
    fetchDataForAllMonths();
  }, []);

  return (
    <div>
      <Chart options={chartData.options} series={chartData.series} type="bar"  height= {380}  width={800} />
    </div>
  );
};

export default BarChart;