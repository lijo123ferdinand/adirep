import React from 'react';
import { Link } from 'react-router-dom';
import './../styles/Navbar.css'; 

function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/Analytics">Analytics</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
