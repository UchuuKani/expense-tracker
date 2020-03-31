import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/users" className="link-button">
        All Users
      </Link>
      <Link to="/tags" className="link-button">
        All Tags
      </Link>
    </nav>
  );
};

export default Navbar;
