import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    <div className="container border p-4 shadow-lg">
      <h2 className="fw-bold">Hi {username}</h2>
      <div>
        <h3>Total amount available: <span className="text-muted">{balance}</span></h3>
      </div>
      <h3>Transactions</h3>
      <div className="table-responsive">
        <table className="table">
          <thead className="border-bottom">
            <tr>
              <th className="text-dark">Category</th>
              <th className="text-dark">Amount</th>
              <th className="text-dark">Expense Date</th>
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
    </div>
  );
}

export default UserProfile;