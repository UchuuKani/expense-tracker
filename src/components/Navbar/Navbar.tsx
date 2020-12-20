import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar: React.FunctionComponent = () => {
  return (
    <nav className={styles.navbar}>
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
