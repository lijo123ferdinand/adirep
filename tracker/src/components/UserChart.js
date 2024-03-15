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

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'User Balance',
          data: balances,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div className="container">
      <h2>User Balance Chart</h2>
      <canvas id="userChart" width="400" height="400"></canvas>
    </div>
  );
}

export default UserChart;
