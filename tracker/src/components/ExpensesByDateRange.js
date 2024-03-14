import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode library
import Chart from 'chart.js/auto'; // Import Chart.js library
import ChartTypeDropdown from './ChartTypeDropdown'; // Import the ChartTypeDropdown component
import DeleteExpense from './DeleteExpense'; // Import the DeleteExpense component

const ExpensesByDateRange = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState(null); // State for chart data
  const [chartType, setChartType] = useState('line'); // Default chart type is line
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;
      setUserEmail(email);
    }
  }, []);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleDateRangeSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch expenses
      const token = getToken();
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.sub;
      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = new Date(endDate).toISOString();

      const response = await axios.get('http://localhost:8086/api/user/expensesByDateRange', {
        params: {
          email: userEmail,
          startDate: isoStartDate,
          endDate: isoEndDate
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
      renderChart(); // Render chart after updating chart data
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    if (chartData) {
      renderChart();
    }
  }, [chartData, chartType]);

  const renderChart = () => {
    const ctx = document.getElementById('expenseChart');
    const existingChart = Chart.getChart(ctx);
  
    if (existingChart) {
      existingChart.destroy();
    }
  
    new Chart(ctx, {
      type: chartType,
      data: {
        labels: chartData.map(data => data.category),
        datasets: [{
          label: 'Expense Categories',
          data: chartData.map(data => data.totalAmount),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  };

  const handleChartTypeChange = (selectedType) => {
    setChartType(selectedType);
  };

  const handleExpenseDelete = async (transactionId) => {
    try {
      // Delete the expense
      await axios.delete(`http://localhost:8086/api/user/expenses/delete/${transactionId}`, {
        params: { email: userEmail }
      });
      
      // Filter out the deleted expense
      const updatedExpenses = expenses.filter(expense => expense.transactionId !== transactionId);
      setExpenses(updatedExpenses);

      // Update chart data after expense deletion
      const categories = updatedExpenses.map(expense => expense.category);
      const uniqueCategories = Array.from(new Set(categories));
      const data = uniqueCategories.map(category => {
        const categoryExpenses = updatedExpenses.filter(expense => expense.category === category);
        const totalAmount = categoryExpenses.reduce((acc, curr) => acc + curr.amount, 0);
        return { category, totalAmount };
      });

      setChartData(data);
      renderChart(); // Render chart after updating chart data
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="card p-4 shadow">
      <h3>Expenses by Date Range</h3>
      <form onSubmit={handleDateRangeSubmit} className="row g-3">
        <div className="col-md-4">
          <label htmlFor="startDate" className="form-label">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="endDate" className="form-label">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <ChartTypeDropdown onChange={handleChartTypeChange} />
        </div>
        <div className="col-md-2 mt-3">
          <button type="submit" className="btn btn-primary">Get Expenses</button>
        </div>
      </form>
      <div className="mt-5">
        <canvas id="expenseChart" width="400" height="400"></canvas>
      </div>
      <div>
        {expenses.map(expense => (
          <div key={expense.transactionId}>
            <p>{expense.category} - ${expense.amount}</p>
            <DeleteExpense
              transactionId={expense.transactionId}
              userEmail={userEmail}
              onDelete={handleExpenseDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesByDateRange;
