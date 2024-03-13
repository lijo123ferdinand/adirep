import React, { useState } from 'react';
import axios from 'axios';

const ExpensesByDateRange = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  
  // Function to retrieve JWT token from local storage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleDateRangeSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve JWT token
      const token = getToken();
      
      // Set headers with JWT token
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      // Make API request with headers
      const response = await axios.get('http://localhost:8086/api/user/expensesByDateRange', {
        params: {
          startDate,
          endDate
        },
        headers: headers
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  return (
    <div>
      <h3>Expenses by Date Range</h3>
      <form onSubmit={handleDateRangeSubmit}>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Get Expenses</button>
      </form>
      <div className="mt-3">
        <h4>Expenses:</h4>
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>{expense.category}: {expense.amount}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpensesByDateRange;
