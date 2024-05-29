import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import ChartContainer from '../components/ChartContainer';
import ChartWithCrosshair from '../components/ChartWithCrosshair';
import '../styles/DashboardPage.css';

function ChildDashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [transactions, setTransactions] = useState([]);

  const updateTransactions = (updatedTransactions) => {
    setTransactions(updatedTransactions);
  };

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      console.log('User Not Found');
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <UserProfile userEmail={userEmail} updateTransactions={updateTransactions} />
      </div>
      <div className="right-panel">
        <div className="chart-card">
          <ChartContainer transactions={transactions} />
        </div>
        <div className="chart-card">
          <ChartWithCrosshair />
        </div>
      </div>
    </div>
  );
}

export default ChildDashboardPage;
