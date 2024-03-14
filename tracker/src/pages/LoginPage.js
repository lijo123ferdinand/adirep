import React, { useState } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import Swal from 'sweetalert2';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let response;
      if (email === 'admin@email.com') {
        response = await axiosInstance.post('/admin/login', { email, password });
      } else {
        response = await axiosInstance.post('/login', { email, password });
      }
    
      if (response.status === 200) {
        console.log('Login successful');
        const token = response.data;
        console.log("Token: ", token);
        localStorage.setItem('token', token);
        if (email === 'admin@email.com') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        console.error('Login failed:', response.data);
        // Handle 401 for unauthorized
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: 'Please check your credentials and try again.',
        });
      }
    } catch(error) {
      console.error('Error:', error);
      // Handle network errors or other unexpected errors
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Incorrect Email or Password.',
      });
    }    
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card login-form shadow-lg" style={{ width: '40%', marginTop: '20vh' }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
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
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
        <div className="row justify-content-left mt-3">
          <div className="col-lg-6">
            <p className="mb-0 text-center">New user? <Link to="/signup">Signup</Link></p>
          </div>
        </div> 
      </div>   
    </div>  
  );
}

export default LoginPage;