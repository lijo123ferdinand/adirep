import React from 'react';
import { Link } from 'react-router-dom';

function ChildNavbar({ hideNavbar }) {
  const handleLinkClick = () => {
    hideNavbar(); // Call hideNavbar function to hide the navbar
  };

  return (
    <nav>
      <ul>
        <li><Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link></li>
        <li><Link to="/analytics" onClick={handleLinkClick}>Analytics</Link></li>
        <li><Link to="/expense-over-time" onClick={handleLinkClick}>Expense Over Time</Link></li>
        {/* Add other child-specific links if needed */}
      </ul>
    </nav>
  );
}

export default ChildNavbar;
