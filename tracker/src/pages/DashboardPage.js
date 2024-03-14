import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import AddExpense from '../components/AddExpense';
import AddSalary from '../components/AddSalary';
import DeleteAllExpenses from '../components/DeleteAllExpenses';
import ChartContainer from '../components/ChartContainer';

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
    <div className="card-container p-4">
      <div className="container-fluid dashboard-container">
        <div className="row">
          <div className="col-md-7">
            <div className="card user-profile" style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
              <UserProfile userEmail={userEmail} />
            </div>
            <div className="card-container">
              <ChartContainer />
            </div>
          </div>
          <div className="col-md-5">
            <div className="row">
              <div className="col">
                <div className="card add-expense" style={{ marginBottom: '10px' }}>
                  <AddExpense />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="card add-salary" style={{ marginBottom: '10px' }}>
                  <AddSalary />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="card delete-all-expenses">
                  <DeleteAllExpenses />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;