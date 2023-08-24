import React from 'react';
import Header from './Header';
import NavbarComp from './NavbarComp';
const Layout = ({ children }) => {
  return (
    <div>
      <Header/>
      <NavbarComp />
      <main>{children}</main>
    </div>
  );
};
export default Layout;