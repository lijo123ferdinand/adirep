import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  const handleLogin = ({ email, password }) => {
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div>
      <h2>Login Page</h2>
      <LoginForm />
      <div>
        New user? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}

export default LoginPage;