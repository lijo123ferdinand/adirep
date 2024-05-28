import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import AddExpense from '../components/AddExpense';
import AddSalary from '../components/AddSalary';
import DeleteAllExpenses from '../components/DeleteAllExpenses';
import ChartContainer from '../components/ChartContainer';
import '../styles/DashboardPage.css';
import ChartWithCrosshair from '../components/ChartWithCrosshair';

function DashboardPage() {
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
    <div className="container-fluid py-5 bg-light-blue">
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card shadow-lg mb-4 card-light-blue border-primary">
            <div className="card-body">
              <UserProfile userEmail={userEmail} updateTransactions={updateTransactions} />
            </div>
          </div>
          <div className="card shadow-lg mb-4 card-light-orange border-warning">
            <div className="card-body">
              <ChartContainer transactions={transactions} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-lg mb-4 card-light-green border-success">
            <div className="card-body">
              <AddExpense />
            </div>
          </div>
          <div className="card shadow-lg mb-4 card-light-red border-danger">
            <div className="card-body">
              <AddSalary />
            </div>
          </div>
          <div className="card shadow-lg mb-4 card-light-purple border-info">
            <div className="card-body">
              <DeleteAllExpenses />
            </div>
            <div className="chart-container">
        <ChartWithCrosshair />
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
