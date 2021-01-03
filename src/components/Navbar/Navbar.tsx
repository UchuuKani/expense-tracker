import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import axios from "axios";

import { UserContext, LOGOUT_EVENT } from "../UserContext/UserContext";
import styles from "./Navbar.module.scss";

const Navbar: React.FunctionComponent = () => {
  const user = useContext(UserContext);
  const history = useHistory();

  const userLoggedIn = user.state && user.state.status === "SIGNED_IN";

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post("/auth/logout");
      user.send({ type: LOGOUT_EVENT });
      history.push("/");
    } catch (logoutErr) {
      console.error(logoutErr);
    }
  };

  // only display links to signup and sign in if user is not logged in
  // if user is logged in, render button to sign out
  const authenticatedNav = (
    <nav className={styles.navbar}>
      <NavLink to="/users" className={styles["link-button"]}>
        All Users
      </NavLink>
      <NavLink to="/tags" className={styles["link-button"]}>
        All Tags
      </NavLink>
      <button
        type="button"
        onClick={handleLogout}
        className={styles["link-button"]}
      >
        Logout
      </button>
    </nav>
  );

  const unaunthenticatedNav = (
    <nav className={styles.navbar}>
      <NavLink to="/users" className={styles["link-button"]}>
        All Users
      </NavLink>
      <NavLink to="/tags" className={styles["link-button"]}>
        All Tags
      </NavLink>
      {}
      <NavLink to="/signup" className={styles["link-button"]}>
        Sign Up
      </NavLink>
      <NavLink to="/signin" className={styles["link-button"]}>
        Sign In
      </NavLink>
    </nav>
  );
  return userLoggedIn ? authenticatedNav : unaunthenticatedNav;
};

export default Navbar;
