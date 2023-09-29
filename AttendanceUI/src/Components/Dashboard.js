import React, { useState, useEffect, useCallback } from "react";
import './Dashboard.css'
import { Bar } from 'react-chartjs-2';
import Chart1 from "react-apexcharts";
import Chart3 from "./Chart.js";
import Slchart from './Slchart.js';
import { People, Block, FreeBreakfast } from '@material-ui/icons';
import axios from "axios";
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale } from 'chart.js';
// Register the scale
// ChartJS.register(LinearScale, CategoryScale);

function Donut() {
  const [activeTab, setActiveTab] = useState('otherCharts');

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
  };

  const [chartData, setChartData] = useState({ series: [], labels: [] });
  const [employee, setEmployee] = useState([]);
  let [departments, setDepartments] = useState([]);
  const [malePercentage, setMalePercentage] = useState(0);
  const [femalePercentage, setFemalePercentage] = useState(0);
  const fetchChartData = useCallback(() => {
    fetch("http://127.0.0.1:7000/attendance/showemp")
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data);
        setDepartments(data.map((employee) => employee.department));
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

  const [selectedDepartment, setSelectedDepartment] = useState('HR');
  const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] = useState([]);
  
  const fetchHRDepartmentData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:7000/attendance/empbydesignation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: "HR", // Replace with the HR department name
        }),
      });
      const data = await response.json();
      setSelectedDepartmentEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const reactdonutcharthandleclick = useCallback(async (selectedDepartmentIndex) => {
    if (selectedDepartmentIndex >= 0) {
      const selectedDeptLabel = chartData.labels[selectedDepartmentIndex];
      const departmentRegex = /^(.*?)\s\(Male:.*$/; // Regular expression to extract the department name
      const selectedDept = selectedDeptLabel.match(departmentRegex)[1];
      setSelectedDepartment(selectedDept);
  
      // Fetch data for the selected department
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
  
  useEffect(() => {
    // Fetch HR department data initially
    fetchHRDepartmentData();
  
    // Fetch chart data
    fetchChartData();
  }, [fetchChartData]);

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
    offsetY: 10,
    fontSize: "10px",
  },
  labels: chartData.labels || [],
  series: chartData.series || [],
  type: "pie",
  dataLabels: {
    style: {
      fontSize: "14px", 
      fontFamily: "serif",
      color: "black"
    },
  },
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
  const breakEmployees = employeeData.employees_on_break || [];
  const data = {
    labels: ["Active Employees", "Inactive Employees", "Break Employees"],
    datasets: [
      {
        label: "Employee Status",
        data: [activeEmployees.length, inactiveEmployees.length, breakEmployees.length],
        backgroundColor: ["rgb(36, 177, 170)", "#FF6384", "skyblue"],
        hoverBackgroundColor: ["rgb(36, 177, 170)", "#FF6384", "skyblue"],
      },
    ],
  };

  const activeEmployeesCount = activeEmployees.length;
  const inactiveEmployeesCount = inactiveEmployees.length;
  const breakEmployeesCount = breakEmployees.length;

  const [chartData4, setChartData4] = useState({
    options: {
      xaxis: {
        type: "category",
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
              type: "category",
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
    labels: ["SL Taken", "SL not Use"],
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

        // Define age group categories
        const ageGroups = [
          { label: "18-24", min: 18, max: 24 },
          { label: "25-34", min: 25, max: 34 },
          { label: "35-44", min: 35, max: 44 },
          { label: "45-54", min: 45, max: 54 },
          { label: "55+", min: 55, max: 200 }, 
        ];

 // Define age group chart data and options
 const [ageGroupChartData, setAgeGroupChartData] = useState({
  labels: [],
  datasets: [],
});

useEffect(() => {
  axios
    .get("http://127.0.0.1:7000/attendance/showemp")
    .then((res) => {
      const employees = res.data;

      // Organize employees by department
      const departments = [...new Set(employees.map((employee) => employee.department))];
      const datasets = departments.map((department) => {
        const departmentEmployees = employees.filter((employee) => employee.department === department);
        const counts = ageGroups.map((ageGroup) => {
          const employeesInAgeGroup = departmentEmployees.filter(
            (employee) => employee.age >= ageGroup.min && employee.age <= ageGroup.max
          );
          return employeesInAgeGroup.length;
        });

        return {
          label: department,
          data: counts,
          backgroundColor: getRandomColor(),
        };
      });

      setAgeGroupChartData({
        labels: ageGroups.map((ageGroup) => ageGroup.label),
        datasets: datasets,
      });
    })
    .catch((err) => {
      console.error(err);
    });
}, []);

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const ageGroupChartOptions = {
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  plugins: {
    tooltips: {
      callbacks: {
        label: (context) => {
          const datasetLabel = context.dataset.label || "";
          const value = context.parsed.y;
          const ageGroup = ageGroupChartData.labels[context.dataIndex];
          const department = context.dataset.label;
          const employeeCountInAgeGroup = context.raw[department][ageGroup];
          return `${datasetLabel}: ${value} employees in age group ${ageGroup} (Count: ${employeeCountInAgeGroup})`;
        },
      },
    },
  },
};

  // Define blood group chart data and options
  const [bloodGroupChartData, setBloodGroupChartData] = useState({
    labels: [],      // Labels for the X-axis (age groups)
    datasets: [],    // Data for blood groups
  });
  
  useEffect(() => {
    // Fetch data for blood groups
    axios
      .get("http://127.0.0.1:7000/attendance/showemp")
      .then((res) => {
        const employees = res.data;
  
        // Extract unique blood group categories from the employees
        const uniqueBloodGroups = [...new Set(employees.map((employee) => employee.BloodGroup))];
  
        // Organize employees by age group and blood group
        const datasets = uniqueBloodGroups.map((bloodGroup) => {
          // Calculate counts for each age group within the blood group
          const counts = ageGroups.map((ageGroup) => {
            const employeesInAgeAndBloodGroup = employees.filter(
              (employee) =>
                employee.age >= ageGroup.min &&
                employee.age <= ageGroup.max &&
                employee.BloodGroup === bloodGroup
            );
            return employeesInAgeAndBloodGroup.length;
          });
  
          return {
            label: bloodGroup,
            data: counts,
            backgroundColor: getRandomColor(),
          };
        });
  
        // Update the blood group chart data
        setBloodGroupChartData({
          labels: ageGroups.map((ageGroup) => ageGroup.label),
          datasets: datasets,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className='side2'><br />
      <div className='Dashboard'>
        {activeTab === "otherCharts" && (
          <div id="otherCharts">
            <a
              href="#employeesjoinedrelieved"
              style={{ fontSize: "14px",fontFamily:"serif"}}
              onClick={() => handleLinkClick("employeesjoinedrelieved")}
            >
              Employees Joined and Relieved Data
            </a>
            <br />
            <h3 style={{ alignItems: "center", display: "flex", justifyContent: "center",fontFamily:"serif" }}>Employee Live Data</h3><br />
            <div className='row'>
              <div className='col-sm-4' style={{ height: 400,width: 150, backgroundColor: "#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', position: 'relative', transition: 'left 0.5s' }}>
                <br /><center style={{ fontSize: "100%" ,fontFamily:"serif", whiteSpace: "nowrap" }}>Employee Count</center><br />
                <div style={{ position: 'absolute', right: '25%', top: "60%" }}>
                  <i className="fa fa-female" aria-hidden="true" style={{ fontSize: '400%', color: "pink" }}></i>
                  <br /><br /><div style={{ fontSize: "16px", fontFamily: "-moz-initial", fontWeight: "bold", marginLeft: "-15%", whiteSpace: "nowrap" }}>F ({femalePercentage}%)</div>
                </div>
                <div style={{ position: 'absolute', right: '20%' }}>
                  <i className="fa fa-male" aria-hidden="true" style={{ fontSize: '400%', color: "skyblue" }}></i>
                  <br /><br /><div style={{ fontSize: "16px", fontFamily: "-moz-initial", fontWeight: "bold", marginLeft: "-20%", whiteSpace: "nowrap" }}>M ({malePercentage}%)</div>
                </div>
              </div>
              <div className='col-sm-4' style={{ height: 400, width: 650, marginLeft: "2%",whiteSpace:"nowrap", backgroundColor: "#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column" }}>
                <div style={{ marginTop: "-4%", fontSize: "100%",fontFamily:"serif", whiteSpace: "nowrap"}}><br />Employee count by Department</div><br />
                <Chart1 style={{ marginTop: "8%", marginLeft: "-2%" }} options={options2} series={chartData.series} type="pie" width="500" height="300" labels={chartData.labels} />
              </div>
              <div className="col-sm-4" style={{ height: 400, width: 280, marginLeft: "2%", maxHeight: "400px", overflowY: "scroll", backgroundColor: "#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', }}>
                {selectedDepartment && (
                  <div style={{ marginLeft: "6%", fontSize: "100%",fontFamily:"serif" }}>
                    <br />
                    <h6 style={{ fontFamily:"serif", marginLeft: "4%" }}>Employees in {selectedDepartment}</h6><br />
                    <table className="table table-hover" style={{ textAlign: "center",fontFamily:"serif" }}>
                      <thead>
                        <tr>
                          <th scope="col" style={{ padding: "10px 20px", fontSize: "14px", fontFamily:"serif" }}>Profile</th>
                          <th scope="col" style={{ padding: "10px 20px", fontSize: "14px", fontFamily:"serif" }}>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDepartmentEmployees.map((employee) => (
                          <tr key={employee.id}>
                            <td>
                            <Link to={`/Fileviewer/${employee.name + '_' + employee.id}`}>
                              <img
                              src={`http://127.0.0.1:7000/attendance/get_file?filename=${employee.name + '_' + employee.id + '_' + 'profile' + '.jpg'}`}
                              style={{
                                display: 'block',
                                margin: 'auto',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                              }}
                              alt="Profile Picture" /></Link></td>
                            <td style={{ padding: "20px 10px", fontSize: "14px", fontFamily:"serif" }}>{employee.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <br />

            <div className='row'>
              <div className='col-sm-6' style={{ height: 400, width: 600, backgroundColor: "#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent: "center", position: "relative", display: "flex", alignItems: "center", flexDirection: "column" }}>
                 <div style={{ fontSize: "100%",fontFamily:"serif", whiteSpace: "nowrap", justifyContent: "center", display: "flex", alignItems: "center" }}><br />Sick Leave</div>
                <Slchart />
              </div>
              {/* <div className='col-sm-6' style={{marginLeft:"2%", height: 400, width: 500, backgroundColor: "#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column" }}>
                <div style={{ fontSize: "100%",fontFamily:"serif", whiteSpace: "nowrap" }}><br />Employee Status</div><br />
                <div className='container5'>
                  <div style={{ backgroundColor: "green" }}>
                    <People />
                    <span>{activeEmployeesCount} Active Employees</span>
                  </div>
                  <div style={{ backgroundColor: "red" }}>
                    <Block />
                    <span>{inactiveEmployeesCount} Not Active Employees</span>
                  </div>
                  <div style={{ backgroundColor: "skyblue" }}>
                    <FreeBreakfast />
                    <span>{breakEmployeesCount} Employees on Break</span>
                  </div>
                </div>
                <div>
                  <Bar height={300} width={400} data={data} />
                </div>
              </div> */}
            </div> 
            <br/>
            <div className="row">
            <div className='col-sm-6' style={{ height: 400, width: 600, backgroundColor: "#F6F8FA", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', justifyContent: "center", position: "relative", display: "flex", alignItems: "center", flexDirection: "column" }}>
              <div style={{ fontSize: "100%",fontFamily:"serif", whiteSpace: "nowrap", justifyContent: "center", display: "flex", alignItems: "center" }}>Age Group Ratio by Department</div>
            <Bar data={ageGroupChartData} options={ageGroupChartOptions} />
            </div>
        
              <div className="col-sm-6" style={{marginLeft:"2%",height: 400, width: 500, backgroundColor: "#F6F8FA",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",justifyContent: "center",position: "relative",display: "flex",alignItems: "center",flexDirection: "column" }}>
                <div style={{fontSize: "100%",fontFamily: "serif",whiteSpace: "nowrap",justifyContent: "center",display: "flex",alignItems: "center",}}>
                  Blood Group Ratio by Age Group
                </div>
                <Bar data={bloodGroupChartData} options={ageGroupChartOptions} />
              </div>
            </div> 
          </div>
        )}

        {activeTab === "employeesjoinedrelieved" && (
          <div id="employeesjoinedrelieved">
            <a
              href="#otherCharts"
              style={{ fontSize: "14px",fontFamily:"serif" }}
              onClick={() => handleLinkClick("otherCharts")}
            >
              Employee Live Data
            </a><br />
            <h2 style={{ alignItems: "center", display: "flex", justifyContent: "center",fontFamily:"serif" }}>Employees Joined and Relieved Data</h2><br />
            <div className='row'>
                <Chart3 />
              </div>
            </div>
        )}
        <br/>
        </div>
    </div>
  );
}
export default Donut;