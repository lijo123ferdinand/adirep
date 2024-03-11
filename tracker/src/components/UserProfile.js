import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../styles/User.css';
import { jwtDecode } from 'jwt-decode';

function UserProfile() {
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    console.log('Balance:', balance);
  }, [balance]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token: ', token);
      const decodedToken = jwtDecode(token);
      console.log('Decoded token: ', decodedToken);
      const userEmail = decodedToken.sub;
      console.log('Email: ', userEmail);
      const response = await axios.get('http://localhost:8086/api/user/info', {
        params: {
          email: userEmail
        }
      });
      console.log(response.data);
      setUsername(response.data.username);
      setBalance(response.data.balance);
      setTransactions(response.data.expenses.reverse() || []); 
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <div className="user-profile-container">
      <h2 className="greeting">Hi {username}</h2>
      <div className="balance-container">
        <h3 className="balance-header">Total amount available:</h3>
        <p className="balance-amount">{balance}</p>
      </div>
      <h3 className="transactions-header">Transactions</h3>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Expense Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.category}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.expenseDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



export default UserProfile;
