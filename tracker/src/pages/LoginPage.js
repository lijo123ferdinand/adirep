import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import Swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode';  // Import jwt-decode

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); 

  useEffect(() => {
    document.body.classList.add('signup-page');
    return () => {
      document.body.classList.remove('signup-page');
    };
  }, []);

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

        // Decode the token and log the fields
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        // Navigate based on user type
        const userType = decodedToken.usertype;
        if (userType === 'admin') {
          navigate('/admin');
        } else if (userType === 'child') {
          navigate('/child');
        } else {
          navigate('/dashboard');
        }
      } else {
        console.error('Login failed:', response.data);
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: 'Please check your credentials and try again.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
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
              <label htmlFor="email" className="form-label" style={{ color: 'white' }}>Email:</label>
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
              <label htmlFor="password" className="form-label" style={{ color: 'white' }}>Password:</label>
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
            <p className="mb-0 text-center" style={{ color: 'white' }}>New user? <Link to="/signup">Signup</Link></p>
          </div>
        </div> 
      </div>   
    </div>  
  );
}

export default LoginPage;
