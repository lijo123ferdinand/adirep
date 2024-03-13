import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode library
import Chart from 'chart.js/auto'; // Import Chart.js library

const ExpensesByDateRange = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState(null); // State for chart data

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleDateRangeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.sub;
      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = new Date(endDate).toISOString();

      const response = await axios.get('http://localhost:8086/api/user/expensesByDateRange', {
        params: {
          email: userEmail, // Pass email as parameter
          startDate: isoStartDate, // Use isoStartDate here
          endDate: isoEndDate // Use isoEndDate here
        },
      });
      setExpenses(response.data);

      // Generate chart data
      const categories = response.data.map(expense => expense.category);
      const uniqueCategories = Array.from(new Set(categories));
      const data = uniqueCategories.map(category => {
        const categoryExpenses = response.data.filter(expense => expense.category === category);
        const totalAmount = categoryExpenses.reduce((acc, curr) => acc + curr.amount, 0);
        return { category, totalAmount };
      });

      setChartData(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // You can add user feedback here, like displaying an error message on the UI
    }
  };

  useEffect(() => {
    if (chartData) {
      renderChart();
    }
  }, [chartData]);

  const renderChart = () => {
    const ctx = document.getElementById('expenseChart');
    const existingChart = Chart.getChart(ctx);
  
    // Destroy existing chart if it exists
    if (existingChart) {
      existingChart.destroy();
    }
  
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartData.map(data => data.category),
        datasets: [{
          label: 'Expense Categories',
          data: chartData.map(data => data.totalAmount),
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
    <div>
      <h3>Expenses by Date Range</h3>
      <form onSubmit={handleDateRangeSubmit}>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Get Expenses</button>
      </form>
      <div className="mt-3">
        <h4>Expenses:</h4>
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>{expense.category}: {expense.amount}</li>
          ))}
        </ul>
      </div>
      <div className="mt-5">
        <canvas id="expenseChart" width="400" height="400"></canvas>
      </div>
    </div>
  );
};

export default ExpensesByDateRange;
