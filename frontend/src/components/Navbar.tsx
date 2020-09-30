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
      <NavLink to="/" className="link-button">
        Sign Up
      </NavLink>
      <NavLink to="/" className="link-button">
        Sign In
      </NavLink>
    </nav>
  );
};

export default Navbar;
