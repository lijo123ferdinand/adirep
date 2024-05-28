import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import AddExpense from '../components/AddExpense';
import AddSalary from '../components/AddSalary';
import DeleteAllExpenses from '../components/DeleteAllExpenses';
import ChartContainer from '../components/ChartContainer';
import '../styles/DashboardPage.css';

function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [transactions, setTransactions] = useState([]);

  const updateTransactions = (updatedTransactions) => {
    setTransactions(updatedTransactions);
  };

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
    <div className="container-fluid py-5" style={{ backgroundColor: '#f0f8ff' }}>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4" style={{ backgroundColor: '#e6f7ff', borderColor: '#007bff' }}>
            <div className="card-body">
              <UserProfile userEmail={userEmail} updateTransactions={updateTransactions} />
            </div>
          </div>
          <div className="card mb-4" style={{ backgroundColor: '#fff3e6', borderColor: '#ffa500' }}>
            <div className="card-body">
              <ChartContainer transactions={transactions} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4" style={{ backgroundColor: '#e6ffe6', borderColor: '#28a745' }}>
            <div className="card-body">
              <AddExpense />
            </div>
          </div>
          <div className="card mb-4" style={{ backgroundColor: '#fff5f5', borderColor: '#ff6347' }}>
            <div className="card-body">
              <AddSalary />
            </div>
          </div>
          <div className="card mb-4" style={{ backgroundColor: '#f2e6ff', borderColor: '#8a2be2' }}>
            <div className="card-body">
              <DeleteAllExpenses />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
