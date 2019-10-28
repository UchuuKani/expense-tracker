import React from "react";
import {Link} from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/users">All Users</Link>
      <Link to="/tags">All Tags</Link>
    </nav>
  )
}

export default Navbar;
