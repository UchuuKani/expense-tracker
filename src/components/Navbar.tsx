import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FunctionComponent = () => {
  return (
    <nav className="navbar">
      <NavLink to="/users" className="link-button">
        All Users
      </NavLink>
      <NavLink to="/tags" className="link-button">
        All Tags
      </NavLink>
    </nav>
  );
};

export default Navbar;
