import React, { useState } from 'react';
import axios from 'axios';
import './../styles/Salary.css';
import { jwtDecode } from 'jwt-decode';

function AddSalary() {
  const [amount, setAmount] = useState('');

  const handleSubmit = async () => {
    // e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token: ', token);
      const decodedToken = jwtDecode(token);
      console.log('Decoded token: ', decodedToken);
      const userEmail = decodedToken.sub;
      console.log('Email: ', userEmail);
      const response = await axios.post('http://localhost:8086/api/user/addSalary', {
        email: userEmail, 
        amount: parseFloat(amount)
      });
      console.log('Salary added successfully:', response.data);
    } catch (error) {
      console.error('Error adding salary:', error);
    }
  };

  return (
    <div className="salary-container">
      <h2>Add Salary</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Add Salary</button>
      </form>
    </div>
  );
}


export default AddSalary;
