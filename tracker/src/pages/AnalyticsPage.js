import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ExpensesByDateRange from '../components/ExpensesByDateRange';
import axios from 'axios';

function AnalyticsPage() {
  const location = useLocation();
  const [childEmail, setChildEmail] = useState('');

  useEffect(() => {
    if (location.state && location.state.childEmail) {
      setChildEmail(location.state.childEmail);
    } else {
      console.error('Child email not found in state');
    }
  }, [location]);

  return (
    <div className="card-container p-4">
      <div className="row">
        <div className="col">
          <h2>Expenses Analysis</h2>
          <ExpensesByDateRange childEmail={childEmail} />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
