import Myconstants from "./Myconstants";
import React, { useState } from "react";
import "./Userpermission.css";

const Userpermission = () => {
  const [role, setRole] = useState("");
  const [activePanel, setActivePanel] = useState("accessControl");
  const [permissions, setPermissions] = useState({
    Employee: false,
    AddEmployee: false,
    Dashboard: false,
    PendingApproval: false,
    AdminRegistration: false,
  });

  const handlePanelClick = (panelName) => {
    setActivePanel(panelName);
  };

  const handleCheckboxChange = (permission) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission],
    });
  };

  const handleSubmit = async () => {
    const data = {
      role: role, // Include the role value in the data object
      employee: permissions.Employee,
      add_employee: permissions.AddEmployee,
      dashboard: permissions.Dashboard,
      pending_approval: permissions.PendingApproval,
      admin_registration: permissions.AdminRegistration,
    };

    console.log("Data to be sent:", data);

    try {
      const response = await fetch("http://127.0.0.1:7000/attendance/userpermission/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});
      if (response.status === 201) {
        // Successfully created the user permission
        console.log("User permission created successfully.");
        // You can reset the form or take any other action here.
      } else {
        // Handle error cases
        console.error("Failed to create user permission.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  
  return (
    <div>
      <div className="Role-select">
        <label style={{ whiteSpace: "nowrap" }}> Assign permissions for the role&nbsp; &nbsp; </label>
        <select
          placeholder="Select A Role"
          className="select2-container selectBox"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" disabled>Select a Role</option>
          {Myconstants.Role.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {roleOption}
            </option>
          ))}
        </select>
      </div>
      <div className="container">
        <div className="row">
          <div className={`col-md-6 panel panel-default ${activePanel === "accessControl" ? "panel-active" : ""}`}>
            <div className="panel-heading ZPbold CP" onClick={() => handlePanelClick("accessControl")}>
              Access Control
            </div><br/>
            <div className="panel-body">
              <div>
                <input
                  type="checkbox"
                  checked={permissions.Employee}
                  onChange={() => handleCheckboxChange("Employee")}
                />{" "}
                Employee
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={permissions.AddEmployee}
                  onChange={() => handleCheckboxChange("AddEmployee")}
                />{" "}
                Add Employee
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={permissions.Dashboard}
                  onChange={() => handleCheckboxChange("Dashboard")}
                />{" "}
                Dashboard
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={permissions.PendingApproval}
                  onChange={() => handleCheckboxChange("PendingApproval")}
                />{" "}
                Pending Approval
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={permissions.AdminRegistration}
                  onChange={() => handleCheckboxChange("AdminRegistration")}
                />{" "}
                Admin Registration
              </div>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userpermission;