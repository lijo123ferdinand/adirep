import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiLogOut, BiKey } from 'react-icons/bi';
import DeleteUserAccount from './DeleteUserAccount';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function NavBar({ userType }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/login">PayPulse</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/analytics">Analytics</Link>
            </li>
            {userType !== 'child' && (
              <li className="nav-item">
                <Link className="nav-link" to="/managekids">Manage Kids</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/addexp">Add Expense</Link>
            </li>
            {userType !== 'child' && (
              <li className="nav-item">
                <Link className="nav-link" to="/addsalary">Add Salary</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/expense-over-time">Expense Over Time</Link>
            </li>
          </ul>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Options
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/login" onClick={handleLogout}>
                      <BiLogOut className="me-2" />
                      Logout
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/passwordReset">
                      <BiKey className="me-2" />
                      Reset Password
                    </Link>
                  </li>
                  <li>
                      <DeleteUserAccount /> {/* Render DeleteUserAccount component */}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
