const Myconstants = Object.freeze({
  shift1Name: 'Morning',
  shift2Name: 'Afternoon',
  shift3Name: 'night',
  Webcamlogin: 'Thanks For Login',
  Webcamalreadylogin: 'You Already Logged in Today',
  Webcamlogout: 'LogOut Successful',
  Webcamnotlogin: 'You Cant Login Today',
  AddEmp: 'Employee Added Sucessfully',
  AddEmpError: 'Some Error Occured in Add Employee',
  shift1: {
    start: '06:00:00',
    end: '12:00:00'
  },
  shift2: {
    start: '12:00:00',
    end: '19:00:00'
  },
  shift3: {
    start: '19:00:00',
    end: '24:00:00'
  },
  employeeexitstatus: ["Voluntary","Relieved","Abscond"],
  lunchlogout: ' Enjoy your meal...! ',
  lunchalreadylogout: 'You are Already in Lunch!',
  lunchlogin: ' Thanks For Login...!',
  departments: ["IT", "DOCTOR", "NURSE", "HR", "LAB", "RT TECH", "PHARMACY", "TELECALLER", "FRONT OFFICE", "SECURITY", "ELECTRICIAN", "ACCOUNTS", "NURSING", "HOUSE KEEPING", "DENSIST CONSULTANT", "COOK"],
  Role:["HR","HR Assistant"],
 // Using an array of strings
  employmentCategoryOptions : [
    { value: "Consultant", label: "Consultant" },
    { value: "OnRoll", label: "OnRoll" },
  ],
   employeeTypeOptions : [
    { value: 'Full Time', label: 'Full Time' },
    { value: 'Part Time', label: 'Part Time' },
    { value: 'Contract', label: 'Contract' },
     ],
});

export default Myconstants;