import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function AddExpense() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async () => {
    try {
      const expenseAmount = parseFloat(amount);
      if (expenseAmount <= 0) {
        alert('Expense amount must be greater than 0.');
        return;
      }
  
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.sub;
      const response = await axios.post('http://localhost:8086/api/user/expenses', {
        email: userEmail, 
        category,
        amount: parseFloat(amount)
      });
      console.log('Expense added successfully');
      console.log(response.data);
      // Display success message
      alert('Expense added successfully!');
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === "Expense exceeds budget limit") {
        alert('Oops! Expense exceeds budget limit.');
      } else {
        alert('Oops! Insufficient Balance.');
      }
    }
  };
  
  return (
    <div className="container border p-4 shadow-lg mt-5">
      <div className="quote mb-4">
        <p className="fs-5 text-center">"Every penny saved is a penny earned."</p>
        <p className="text-center">- Benjamin Franklin</p>
      </div>
      <h2 className="fw-bold">Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Expense</button>
      </form>
    </div>
  );
}

export default AddExpense;
