import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ExpensesByDateRange from '../components/ExpensesByDateRange';

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
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center">
          <h1 className="display-4 text-primary">Expenses Analysis</h1>
          <p className="lead text-secondary">
            Analyze and track expenses for a specific date range. Gain insights into spending patterns and budget management.
          </p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#ffffff' }}>
            <div className="card-body">
              <ExpensesByDateRange childEmail={childEmail} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
