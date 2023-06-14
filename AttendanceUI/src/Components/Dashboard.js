import DonutChart from 'react-donut-chart';
import * as ReactBootStrap from "react-bootstrap";
import React, { useState, useEffect, useCallback } from "react";
import { Item } from 'semantic-ui-react';
import './Dashboard.css'
import Chart from 'chart.js/auto';
import { Bar,Doughnut } from "react-chartjs-2";
import Chart1 from "react-apexcharts";
import Chart3 from "./Chart.js";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";
import { People, Block, FreeBreakfast } from '@material-ui/icons';
import axios from "axios";
import Footer from "./Footer"

const Donut = () => {
  const [chartData, setChartData] = useState({ series: [], labels: [] });
  const [employee,setEmployee]=useState([]);
  let [departments,setDepartments] = useState([]);
  const [malePercentage, setMalePercentage] = useState(0);
const [femalePercentage, setFemalePercentage] = useState(0);
const fetchChartData = useCallback(() => {
  fetch("https://smrftadmin.onrender.com/attendance/showemp")
    .then((res) => res.json())
    .then((data) => {
      setEmployee(data);
      departments = data.map((employee) => employee.department);
      setDepartments(departments);
      console.log(data)
      console.log("empolyee:",employee)
      const chartData = {};
      data.forEach((employee) => {
        const { department, Gender } = employee;
        if (!chartData[department]) {
          chartData[department] = { male: 0, female: 0, employees: [] };
        }
        chartData[department][Gender]++;
        chartData[department].employees.push(employee);
      });
      const series = Object.values(chartData).map(({ male, female }) => male + female);
      const labels = Object.entries(chartData).map(([department, { male, female }]) => {
        const label = `${department} (Male: ${male}, Female: ${female})`;
        return label;
      });
      setChartData({ series, labels });
      // Calculate male and female percentages
      const maleCount = Object.values(chartData).reduce((total, { male }) => total + male, 0);
      const femaleCount = Object.values(chartData).reduce((total, { female }) => total + female, 0);
      const totalCount = maleCount + femaleCount;
      const malePercentage = (maleCount / totalCount) * 100;
      const femalePercentage = (femaleCount / totalCount) * 100;
      // Update state variables
      setMalePercentage(malePercentage.toFixed(0));
      setFemalePercentage(femalePercentage.toFixed(0));
    });
}, []);
  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);
const [chart, setChart] = useState([]);
const reactdonutcharthandleclick = useCallback((selectedDepartmentIndex) => {
  console.log("test", departments);
  if (selectedDepartmentIndex >= 0) {
    fetch("https://smrftadmin.onrender.com/attendance/empbydesignation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        department: departments[selectedDepartmentIndex],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setChart(data);
      });
  }
}, [departments,chartData]);
const options2 = {
  chart: {
    events: {
      dataPointSelection: (event, chartContext, config) => {
        const selectedDepartmentIndex = config.dataPointIndex;
        reactdonutcharthandleclick(selectedDepartmentIndex);
      },
    },
  },
  legend: {
    position: "bottom",
    offsetY: 10,
    fontSize: "12px",
  },
  labels: chartData.labels || [],
  series: chartData.series || [],
  type: "donut",
};

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
const [employeeData, setEmployeeData] = useState([]);

useEffect(() => {
  axios
    .get("https://smrftadmin.onrender.com/attendance/breakdetails")
    .then((response) => {
      setEmployeeData(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}, []);

const activeEmployees = employeeData.employees_active || [];
const inactiveEmployees = employeeData.employees_not_active || [];
const breakEmployees = employeeData.employees_on_break || [];

const chartData2 = [
  {
    label: "Active Employees",
    value: activeEmployees.length,
    color: "#36A2EB",
  },
  {
    label: "Inactive Employees",
    value: inactiveEmployees.length,
    color: "#FF6384",
  },
  {
    label: "Break Employees",
    value: breakEmployees.length,
    color: "#8ED0E4",
  },
];

const dataSource = {
  chart: {
    caption: "Employee Status Distribution",
    plottooltext: "<b>$value</b> employees are $label",
    showlegend: "1",
    showpercentvalues: "0", // set to 0 to show count instead of percentage
    legendposition: "bottom",
    usedataplotcolorforlabels: "1",
    theme: "fusion",
  },
  data: chartData2,
};



const activeEmployeesCount = activeEmployees.length;
const inactiveEmployeesCount = inactiveEmployees.length;
const breakEmployeesCount = breakEmployees.length;
    const [deletedEmployees2, setDeletedEmployees2] = useState([]);
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
          height: 350,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [],
          title: {
            text: "Months",
          },
          labels: {
            style: {
              fontSize: "14px",
            },
          },
        },
        yaxis: {
          title: {
            text: "Number of Employees Realiving",
          },
        },
        fill: {
          opacity: 1,
        },
      },
    });
    
    useEffect(() => {
      axios
        .get("https://smrftadmin.onrender.com/attendance/deleted-employees/")
        .then((res) => {
          const employees = res.data;
          const months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setUTCMonth(i);
            return date.toLocaleString('default', { month: 'long' });
          });
          const currentYear = new Date().getFullYear(); // get current year
          const employeeCounts = Array.from({ length: 12 }, () => 0);
          const employeeNames = Array.from({ length: 12 }, () => []);
          employees.forEach((employee) => {
            const date = new Date(employee.deleted_at);
            if (date.getFullYear() === currentYear) { // count employees only for current year
              const monthIndex = date.getMonth();
              employeeCounts[monthIndex]++;
              employeeNames[monthIndex].push(employee.name);
            }
          });
          const employeeCountByMonth = months.map((month, i) => {
            return { month: month, count: employeeCounts[i], names: employeeNames[i] };
          });
          const tooltip = {
            y: {
              formatter: function (val) {
                return val + " employees";
              },
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const month = w.globals.labels[dataPointIndex];
              const count = series[seriesIndex][dataPointIndex];
              const names = seriesIndex === 0 ? employeeCountByMonth[dataPointIndex].names : null;
              let content = `<div class="tooltip-header">${month} ${currentYear}</div>`; // show current year in tooltip
              content += `<div class="tooltip-body">${count} employees</div>`;
              if (names) {
                content += `<div class="tooltip-body">Employees: ${names.join(", ")}</div>`;
              }
              return content;
            },
          };
          setChartOptions((prevState) => ({
            ...prevState,
            series: [
              {
                name: "Added Employees",
                data: employeeCountByMonth.map((entry) => entry.count),
              },
            ],
            options: {
              ...prevState.options,
              xaxis: {
                categories: months,
                title: {
                  text: "Months",
                },
                labels: {
                  style: {
                    fontSize: "14px",
                  },
                },
              },
              tooltip: tooltip,
            },
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

    
    const [chartData4, setChartData4] = useState({
      options: {
        xaxis: {
          categories: [],
          title: {
            text: "Months",
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " employee(s)";
            },
          },
        },
      },
      series: [
        {
          name: "Employees Added",
          data: [],
        },
      ],
    });
    useEffect(() => {
      axios
        .get("https://smrftadmin.onrender.com/attendance/showemp")
        .then((res) => {
          // Map the data to an object with month and employee name properties
          const employeeData = res.data.map((employee) => {
            const addedDate = new Date(employee.
              dateofjoining);
            return {
              month: addedDate.toLocaleString("default", { month: "long" }),
              name: employee.name,
            };
          });
          
          // Group the employee data by month
          const groupedData = employeeData.reduce((acc, employee) => {
            if (!acc[employee.month]) {
              acc[employee.month] = [];
            }
            acc[employee.month].push(employee);
            return acc;
          }, {});
          
          // Populate the chart data with the grouped employee data
          const categories = Object.keys(groupedData);
          const seriesData = categories.map((category) => {
            return groupedData[category].length;
          });
          setChartData4({
            options: {
              xaxis: {
                categories: categories,
                title: {
                  text: "Months"
                }
              },
              tooltip: {
                y: {
                  formatter: function (val, { seriesIndex, dataPointIndex }) {
                    const employeeName = groupedData[categories[seriesIndex]][dataPointIndex].name;
                    return `${val} employee(s) added by ${employeeName}`;
                  },
                },
              },
              
            },
            series: [
              {
                name: "Employees Added",
                data: seriesData,
              },
            ],
          });
          
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const [userExportData, setUserExportData] = useState([]);
    
    useEffect(() => {
      const getExportData = async () => {
        fetch("https://smrftadmin.onrender.com/attendance/EmployeeSummaryExport", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            month: currentMonth,
            year: currentYear,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setUserExportData(data);
          });
      };
      getExportData();
    }, []);
    
    const slTakenByUser = userExportData.reduce((acc, user) => {
      return acc + user.SL_Taken;
    }, 0);
    
    const totalUsers = userExportData.length;
    const slTakenPercentage = (slTakenByUser / (totalUsers * 12)) * 100;
    
    const chartOptions8 = {
      chart: {
        type: "pie",
      },
      series: [slTakenPercentage, 100 - slTakenPercentage],
      labels: ["SL Taken", "SL Not Using"],
      pie: {
        offsetX: -10,
        offsetY: 30,
      },
    };
    
return (
  <body className='dashboard'>
  <div style={{ fontSize:"200%", marginTop:"15%", fontFamily:"cursive", fontWeight:"bold"}}>Dashboard</div>
  <br/>
  <div className='row'>
  <div className='col-sm-6' style={{ backgroundColor:"#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent:"center", display: "flex", alignItems: "center", flexDirection: "column"}}>
    <div style={{ fontSize:"100%", fontFamily:"cursive",whiteSpace:"nowrap"}}><br/>Employee count by Department</div><br/>
    <Chart1 options={options2} series={chartData.series} type="donut" width="400" height="300" labels={chartData.labels} />
  </div>
  <div className='col-sm-6' style={{ height: 300 , width:400,backgroundColor:"#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', position: 'relative', right: '-5%', transition: 'left 0.5s' }}>
  <br/><center style={{fontSize:"100%", fontFamily:"cursive",whiteSpace:"nowrap"}}>Employee Male & Female Count</center><br/>
  <div style={{position: 'absolute',right: '15%' }}>
    <i className="fa fa-female" aria-hidden="true" style={{ fontSize: '600%',color:"pink" }}></i>
    <br/><br/><div style={{fontSize:"18px",fontFamily:"-moz-initial",fontWeight:"bold"}}>Female ({femalePercentage}%)</div>
  </div>
  <div style={{position: 'absolute',  right: '50%'}}>
    <i className="fa fa-male" aria-hidden="true" style={{ fontSize: '600%',color:"skyblue" }}></i>
    <br/><br/><div style={{fontSize:"18px",fontFamily:"-moz-initial",fontWeight:"bold"}}>Male ({malePercentage}%)</div>
  </div>
  </div>
  </div>
  <br/>

<div className='row'>
  <div className='col-sm-6' style={{ backgroundColor:"#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent:"center", position:"relative", display: "flex", alignItems: "center", flexDirection: "column"}}>
  <div style={{ fontSize:"100%", fontFamily:"cursive",whiteSpace:"nowrap"}}><br/>Employee SL Percentage</div><br/>
    <Chart1 options={chartOptions8} series={chartOptions8.series} type="pie" height={300} width={400}/>
  </div>


</div>
<div className='col-sm-6'>
    <Chart3/>
  </div>
<br/>

<div className='row'>
  <div className='col-sm-6' style={{ backgroundColor:"#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent:"center", position:"relative", display: "flex", alignItems: "center", flexDirection: "column"}}>
  <div style={{ fontSize:"100%", fontFamily:"cursive",whiteSpace:"nowrap"}}><br/>Number Of Employees Relieved</div><br/>
    <Chart1 options={chartOptions.options} series={chartOptions.series} type="bar" height={350} width={500} />
  </div>
  <div className='col-sm-6' style={{  backgroundColor:"#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent:"center", display: "flex", alignItems: "center", flexDirection: "column"}}>
  <div style={{ fontSize:"100%", fontFamily:"cursive",whiteSpace:"nowrap"}}><br/>Employee Status</div><br/>
    <div className='container5'>
      <div style={{backgroundColor:"rgb(36, 177, 170)"}}>
      <People />
      <span>{activeEmployeesCount} Active Employees</span>
      </div>
      <div style={{backgroundColor:"#FF6384"}}>
        <Block />
        <span>{inactiveEmployeesCount} Not Active Employees</span>
      </div>
      <div style={{backgroundColor:"skyblue"}}>
        <FreeBreakfast />
        <span>{breakEmployeesCount} Employees on Break</span>
      </div>
    </div>
    <div>
    <ReactFC
      type="pie3d"
      width="50%"
      height="50%"
      dataFormat="JSON"
      dataSource={dataSource}
    />
  </div>
  </div>
  
  </div>

</body>

      
    )
}
export default Donut;