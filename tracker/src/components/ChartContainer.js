import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ChartContainer = ({ transactions }) => {
  const [username, setUsername] = useState('');
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

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

      const lines = response.data.trim().split('\n');
      lines.shift();

      const dataArray = lines.map(line => {
        const [category, percentage] = line.split(':');
        return { category: category.trim(), percentageSpent: parseFloat(percentage) };
      });

      return dataArray;
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      return [];
    }
  };

  useEffect(() => {
    const renderChart = async () => {
      const analysisData = await fetchData();
      if (!Array.isArray(analysisData)) {
        console.error('Analysis data is not an array.');
        return;
      }

      const ctx = chartRef.current.getContext('2d');

      const labels = analysisData.map(item => item.category);
      const percentages = analysisData.map(item => item.percentageSpent);

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const customColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF8A80', '#A1887F', '#4DD0E1', '#FF5722', '#009688', '#FF1744', '#00E676', '#FF4081', '#18FFFF', '#651FFF', '#FF6E40', '#FFD740', '#7C4DFF', '#1DE9B6', '#C51162', '#FF5252', '#2962FF', '#FFD740', '#64DD17', '#FFAB00', '#FF1744', '#00B8D4', '#FF6D00', '#FFEA00', '#00C853'];

      chartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Percentage Spent',
            data: percentages,
            backgroundColor: customColors,
            borderColor: customColors
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                boxWidth: 20,
                padding: 15
              }
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                }
              }
            }
          }
        }
      });
    };

    renderChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [transactions]);

  return (
    <div className="container">
      <div className="card chart-card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title text-primary">Expenses Analysis</h5>
          <div className="chart-container">
            <canvas ref={chartRef} width="50" height="50"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
