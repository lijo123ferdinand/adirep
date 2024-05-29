import React from 'react';
import AddExpense from '../components/AddExpense';
import AddSalary from '../components/AddSalary';
import '../styles/AddExpenseAndSalaryPage.css';  // Optional: add styles

const AddExpenseAndSalaryPage = () => {
  return (
    <div className="container py-5 bg-light">
      <div className="row justify-content-center">
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg card-light-green border-success">
            <div className="card-body">
              <AddExpense />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg card-light-red border-danger">
            <div className="card-body">
              <AddSalary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseAndSalaryPage;
