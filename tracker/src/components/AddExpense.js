import React, { useState } from 'react';
import axios from 'axios';
import './../styles/Expense.css';

function AddExpense() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const userEmail = localStorage.getItem('userEmail');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8086/api/user/expenses', {
        email: userEmail, 
        category,
        amount: parseFloat(amount)
      });
      console.log('Expense added successfully:', response.data);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };
  

  return (
    <div className="expense-container"> {/* Add className for the container */}
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"> {/* Add className for the form group */}
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group"> {/* Add className for the form group */}
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Add Expense</button> {/* Add className for the submit button */}
      </form>
    </div>
  );
}


export default AddExpense;
