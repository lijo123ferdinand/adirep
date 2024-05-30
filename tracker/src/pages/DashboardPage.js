import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import ChartContainer from '../components/ChartContainer';
import ChartWithCrosshair from '../components/ChartWithCrosshair';
import '../styles/DashboardPage.css';
import { useNavigate } from 'react-router-dom';
import AddExpenseModal from '../pages/AddExpenseModal';
import { Button } from 'react-bootstrap';

function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);


  const updateTransactions = (updatedTransactions) => {
    setTransactions(updatedTransactions);
  };

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      console.log('User Not Found');
    }
  }, []);
  const handleAddExpense = () => {
    navigate('/dashboard'); // Adjust the path to match your routing
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <UserProfile userEmail={userEmail} updateTransactions={updateTransactions} />
      </div>
      <div className="right-panel">
        <div className="chart-card">
          <div className="chart-wrapper">
            <ChartContainer transactions={transactions} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-wrapper">
            <ChartWithCrosshair />
          </div>
        </div>
      </div>
      <Button
        className="floating-button"
        onClick={handleShowModal}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
        }}
      >
        +
      </Button>
      <AddExpenseModal
        show={showModal}
        handleClose={handleCloseModal}
                handleSave={handleAddExpense}
      />
    </div>
  );
}

export default DashboardPage;
