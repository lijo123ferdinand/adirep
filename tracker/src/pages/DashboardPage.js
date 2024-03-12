import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import AddExpense from '../components/AddExpense';
import AddSalary from '../components/AddSalary';
import DeleteAllExpenses from '../components/DeleteAllExpenses';
import './../styles/Dashboard.css';

function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Retrieve user email from local storage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      console.log('User Not Found');
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="user-profile">
        <UserProfile userEmail={userEmail} />
      </div>
      <div className="expense-salary-container">
        <div className="add-expense">
          <AddExpense />
        </div>
        <div className="add-salary">
          <AddSalary />
        </div>
        <div>
          <DeleteAllExpenses />
        </div>
      </div>
    </div>
  );
}


export default DashboardPage;
