import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js library
import axios from 'axios';

function UserChart() {
  const [userData, setUserData] = useState([]);
  let userChartInstance = null; // Variable to store the chart instance

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

    // Ensure that the existing chart is destroyed before rendering a new one
    if (userChartInstance !== null) {
      userChartInstance.destroy();
    }

    // Extracting labels (usernames) and data (balances) for the chart
    const labels = userData.map(user => user.username);
    const balances = userData.map(user => user.balance);
    const customColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF8A80', '#A1887F', '#4DD0E1', '#FF5722', '#009688', '#FF1744', '#00E676', '#FF4081', '#18FFFF', '#651FFF', '#FF6E40', '#FFD740', '#7C4DFF', '#1DE9B6', '#C51162', '#FF5252', '#2962FF', '#FFD740', '#64DD17', '#FFAB00', '#FF1744', '#00B8D4', '#FF6D00', '#FFEA00', '#00C853'];

    // Create the new chart instance
    userChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'User Balance',
          data: balances,
          backgroundColor: customColors,
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
