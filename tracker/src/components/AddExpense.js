import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

function AddExpense() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  // const [error, setError] = useState('');

  const handleSubmit = async () => {
    console.log('HanleSubmit clicked!!')
    try {
      console.log('Inside Try Block!!')
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
      // setError('');
    } catch (error) {
      console.log('ERROR: ', error.response);
      // console.log(error.response.data.message);
      if (error.response && error.response.status === 400) { 
        // error.response && error.response.status === 400  && error.response.data.message === 'Insufficient balance'
        console.log('Oops! Insufficient Balance.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Oops! Insufficient Balance.',
        });
      } else {
        console.error('Error adding expense:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error adding expense :(',
        });
      }
    }
  };
  
  return (
    <div className="container border p-4 shadow-lg">
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
