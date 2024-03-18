// UserChart.js
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js library
import axios from 'axios';

function UserChart() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Fetch user data from the API endpoint
    axios.get('http://localhost:8086/api/admin/users')
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    if (userData.length > 0) {
      renderChart();
    }
  }, [userData]);

  const renderChart = () => {
    const ctx = document.getElementById('userChart');

    // Extracting labels (usernames) and data (balances) for the chart
    const labels = userData.map(user => user.username);
    const balances = userData.map(user => user.balance);
    const customColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF8A80', '#A1887F', '#4DD0E1'];


    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'User Balance',
          data: balances,
          backgroundColor: customColors,
          borderColor: customColors,
          borderWidth: 1
        }]
      }
    });
  };

  return (
    <div className="container">
      <h2>User Balance Chart</h2>
      <canvas id="userChart" width="50" height="50"></canvas>
    </div>
  );
}

export default UserChart;
