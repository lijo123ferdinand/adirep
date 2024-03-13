import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const ChartContainer = () => {
  const [username, setUsername] = useState('');
  const chartContainerRef = useRef(null);
  const [analysisData, setAnalysisData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          const decodedToken = jwtDecode(token);
          const userEmail = decodedToken.sub;
          const response = await axios.get('http://localhost:8086/api/user/expenses/analysis', {
            params: {
              email: userEmail
            }
          });
          setUsername(response.data.username);
          console.log(username);
          // Split the response body by lines
          const lines = response.data.trim().split('\n');
          lines.shift();
    
          // Extract category name and percentage spent from each line
          const dataArray = lines.map(line => {
            const [category, percentage] = line.split(':');
            return { category: category.trim(), percentageSpent: parseFloat(percentage) }; // Convert percentage to float
          });
      
          setAnalysisData(dataArray);
        } catch (error) {
          console.error('Error fetching analysis data:', error);
        }
      };
    fetchData();
  }, []);

  useEffect(() => {
    if (analysisData && analysisData.length > 0) {
      renderChart();
    }
  }, [analysisData]);

  const renderChart = () => {
    if (!Array.isArray(analysisData)) {
      console.error('Analysis data is not an array.');
      return;
    }

    const ctx = chartContainerRef.current.getContext('2d');

    const labels = analysisData.map(item => item.category);
    const percentages = analysisData.map(item => item.percentageSpent);

    new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Percentage Spent',
            data: percentages,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ]
          }]
        },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  };

  return (
    <div className="chart-container">
      <canvas ref={chartContainerRef} width="400" height="400"></canvas>
    </div>
  );
};

export default ChartContainer;