import React, { useState } from 'react';
import axios from 'axios';
import './../styles/Signup.css'; // Import Signup.css for styling

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8086/api/signup', {
        email,
        password,
        username,
        balance: balance || null 
      });
      console.log('Signup successful:', response.data);
    } catch (error) {
      console.log('User with this email already exists');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <div>
        <label htmlFor="balance">Balance:</label>
        <input
          type="number"
          id="balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className="form-input"
        />
      </div>
      <button type="submit" className="form-button">Sign up</button>
    </form>
  );
}

export default SignupForm;
