import DonutChart from 'react-donut-chart';
import * as ReactBootStrap from "react-bootstrap";
import React, { useState, useEffect, useCallback } from "react";
import { Item } from 'semantic-ui-react';
import './Dashboard.css'
import Chart from 'chart.js/auto';
import { Bar,Doughnut } from "react-chartjs-2";
import Chart1 from "react-apexcharts";
import Chart3 from "./Chart.js";
import Slchart from './Slchart.js';
import { People, Block, FreeBreakfast } from '@material-ui/icons';
import axios from "axios";
import Chart5 from './Deletechart.js';
const Donut = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [activeTab, setActiveTab] = useState('otherCharts');

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
  };

  const [chartData, setChartData] = useState({ series: [], labels: [] });
  const [employee,setEmployee]=useState([]);
  let [departments,setDepartments] = useState([]);
  const [malePercentage, setMalePercentage] = useState(0);
const [femalePercentage, setFemalePercentage] = useState(0);
const fetchChartData = useCallback(() => {
  fetch("http://127.0.0.1:7000/attendance/showemp")
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
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] = useState([]);
  
  const reactdonutcharthandleclick = useCallback(async (selectedDepartmentIndex) => {
    if (selectedDepartmentIndex >= 0) {
      const selectedDeptLabel = chartData.labels[selectedDepartmentIndex];
      const departmentRegex = /^(.*?)\s\(Male:.*$/; // Regular expression to extract the department name
      const selectedDept = selectedDeptLabel.match(departmentRegex)[1];
      setSelectedDepartment(selectedDept);
  
      try {
        const response = await fetch("http://127.0.0.1:7000/attendance/empbydesignation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department: selectedDept,
          }),
        });
        const data = await response.json();
        setSelectedDepartmentEmployees(data);
      } catch (error) {
        console.error(error);
      }
    }
  }, [chartData.labels]);
  
  
  
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
      position: "right",
      offsetY: -15,
      fontSize: "10px",
    },
    labels: chartData.labels || [],
    series: chartData.series || [],
    type: "donut",
  };

    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
      axios
        .get("http://127.0.0.1:7000/attendance/breakdetails")
        .then((response) => {
          setEmployeeData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);
  
    const activeEmployees = employeeData.employees_active || [];
    const inactiveEmployees = employeeData.employees_not_active || [];
    const breakEmployees = employeeData.employees_on_break    || [];
    const data = {
      labels: ["Active Employees", "Inactive Employees","Break Employees"],
      datasets: [
        {
          label: "Employee Status",
          data: [activeEmployees.length, inactiveEmployees.length,breakEmployees.length],
          backgroundColor: ["rgb(36, 177, 170)", "#FF6384", "skyblue"],
          hoverBackgroundColor: ["rgb(36, 177, 170)", "#FF6384", "skyblue"],
        },
      ],
    };
  
    const activeEmployeesCount = activeEmployees.length;
    const inactiveEmployeesCount = inactiveEmployees.length;
    const breakEmployeesCount = breakEmployees.length;
   
    const [deletedEmployees2, setDeletedEmployees2] = useState([]);


    
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
        .get("http://127.0.0.1:7000/attendance/showemp")
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
        fetch("http://127.0.0.1:7000/attendance/EmployeeSummaryExport", {
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
      labels: ["SL Taken","SL not Use"],
      pie: {
        offsetX: -10,
        offsetY: 30,
      },
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'blue', // Customize label color
        },
      },
    };
    
return (
  <body className='side2'><br/>
  <div className='Dashboard'>
  {activeTab === "otherCharts" && (    
  <div id="otherCharts">
     <a
        href="#employeesjoinedrelieved"
        style={{ fontSize: "14px" }}
        onClick={() => handleLinkClick("employeesjoinedrelieved")}
      >
        Employees Joined and Relieved Data
      </a>
  <br/>
  <h2 style={{alignItems:"center",display:"flex",justifyContent:"center"}}>Employee Live Data</h2><br/>
  <div className='row'>
  <div className='col-sm-6' style={{ height: 400 , width:200,marginLeft:-75, backgroundColor: "#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', position: 'relative', right: '-5%', transition: 'left 0.5s' }}>
  <br/><center style={{ marginLeft:"9%",fontSize: "100%", fontFamily: "cursive", whiteSpace: "nowrap" }}>Employee M & F Count</center><br/>
  <div style={{position: 'absolute',right: '30%',top:"60%" }}>
    <i className="fa fa-female" aria-hidden="true" style={{ fontSize: '400%',color:"pink" }}></i>
    <br/><br/><div style={{fontSize:"16px",fontFamily:"-moz-initial",fontWeight:"bold",marginLeft:"-15%",whiteSpace:"nowrap"}}>F ({femalePercentage}%)</div>
  </div>
  <div style={{position: 'absolute',  right: '25%'}}>
    <i className="fa fa-male" aria-hidden="true" style={{ fontSize: '400%',color:"skyblue" }}></i>
    <br/><br/><div style={{fontSize:"16px",fontFamily:"-moz-initial",fontWeight:"bold",marginLeft:"-15%",whiteSpace:"nowrap"}}>M ({malePercentage}%)</div>
  </div>
</div>
  <div className='col-sm-6' style={{ height: 400 , width:800,marginLeft:120,backgroundColor:"#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent:"center", display: "flex", alignItems: "center", flexDirection: "column"}}>
    <div style={{ fontSize:"100%", fontFamily:"cursive",whiteSpace:"nowrap"}}><br/>Employee count by Department</div><br/>
    <Chart1 options={options2} series={chartData.series} type="donut" width="500" height="300" labels={chartData.labels} />
  </div>
  <div className="col-sm-4" style={{ height: 400 ,marginLeft:"4%", width:550,maxHeight: "400px", overflowY: "scroll",backgroundColor:"#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', }}>
  {selectedDepartment && (
  <div style={{marginLeft:"20%",fontSize:"100%",fontFamily:"cursive"}}>
    <br/>
    <h6 style={{fontFamily:"cursive",marginLeft:"20%"}}>Employees in {selectedDepartment}</h6><br/>
    <table style={{ textAlign: "center", width: "120%" ,marginLeft:'-20%'}}>
      <thead>
        <tr>
        <th scope="col" style={{ padding: "10px 20px", fontSize: "14px", width: "20%" }}>Profile</th>
<th scope="col" style={{ padding: "10px 20px", fontSize: "14px", width: "40%" }}>Name</th>


        </tr>
      </thead>
      <tbody>
        {selectedDepartmentEmployees.map((employee) => (
          <tr key={employee.id}>
            <td>      <img
          src={`http://127.0.0.1:7000/attendance/get_file?filename=${employee.name + '_' + employee.id + '_' + 'profile' + '.jpg'}`}
          style={{
            display: 'block',
            margin: 'auto',
            marginTop:"-8%",
            width: '50px',
            height: '50px',
            borderRadius: '50%',  
          }}
          alt="Profile Picture"
        /></td>
            <td style={{ padding: "20px 10px", fontSize:"12px" }}>{employee.name}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
</div>

</div> 
  <br/>

<div className='row'>
  <div className='col-sm-6' style={{height: 400 , width:800,marginLeft:10, backgroundColor:"#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent:"center", position:"relative", display: "flex", alignItems: "center", flexDirection: "column"}}>
 
  <Slchart/>
  </div>
  <div className='col-sm-6' style={{ height: 400 , width:800, marginLeft:100, backgroundColor:"#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent:"center", display: "flex", alignItems: "center", flexDirection: "column"}}>
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
    <Bar height={300} width={400} data={data} />
  </div>
  </div>
</div>
</div>
  )}

{activeTab === "employeesjoinedrelieved" && (
<div id="employeesjoinedrelieved">
<a
  href="#otherCharts"
  style={{ fontSize: "14px" }}
  onClick={() => handleLinkClick("otherCharts")}
  >
  Employee Live Data
</a><br/>
<h2 style={{alignItems:"center",display:"flex",justifyContent:"center"}}>Employees Joined and Relieved Data</h2><br/>
<div className='row'>
  <div className='col-sm-6'>
    <Chart3/>
  </div>
    <Chart5 />
  </div>
  </div>

)}
</div>
</body>    
    )
}
export default Donut;