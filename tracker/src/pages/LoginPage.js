import React, { useState } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axiosInstance.post('/login', {
        email,
        password
      });
  
      if (response.status === 200) {
        console.log('Login successful');
        const token = response.data;
        console.log("Token: ", token);
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        console.error('Login failed:', response.data);
        // Handle 401 for unauthorized
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch(error) {
      console.error('Error:', error);
      // Handle network errors or other unexpected errors
      alert('An error occurred. Please try again later.');
    }
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
    <div className="card login-form shadow-lg" style={{ width: '40%' }}>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
  );
}

export default LoginPage;