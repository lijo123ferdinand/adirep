import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';

function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Retrieve user email from local storage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      console.log('User Not Found');
    }
  }, []);

  return (
    <div>
      <UserProfile userEmail={userEmail} />
    </div>
  );
}

export default DashboardPage;
