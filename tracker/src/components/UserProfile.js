import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (userEmail) {
      fetchUserProfile();
    }
  }, [userEmail]);

  useEffect(() => {
    console.log('Balance:', balance);
  }, [balance]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8086/api/user/info', {
        params: {
          email: userEmail
        }
      });
      console.log(response.data);
      setUsername(response.data.username);
      setBalance(response.data.balance);
      setTransactions(response.data.transactions || []); // Ensure transactions is initialized as an empty array
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <div>
      <h2>Hi {username}</h2>
      <h3>Total amount available: {balance}</h3>
      <h3>Transactions</h3>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.description}: {transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;
