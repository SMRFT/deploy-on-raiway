import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import AdminReg from "../Adminreg";

const SettingsPage = () => {
  const [showAdminReg, setShowAdminReg] = useState(false);
  const toggleAdminReg = () => {
    setShowAdminReg(!showAdminReg);
  };
  return (
    <div>
      <Layout />
      <center>
        <div>
          <Link to="/admin/Viewemp/SettingsPage/AdminReg" className="link-with-space" onClick={toggleAdminReg}>
            Adminreg
          </Link>
          <Link to="/SettingsPage/user-permission" className="link-with-space">
            User Permission
          </Link>
        </div>
        {showAdminReg && <AdminReg />}
      </center>
    </div>
  );
};
export default SettingsPage