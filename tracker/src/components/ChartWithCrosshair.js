import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Correct import for jwt-decode

const ChartWithCrosshair = () => {
  const [chartType, setChartType] = useState('line');
  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: 'basic-line',
      toolbar: {
        show: false
      },
      crosshairs: {
        show: true
      }
    },
    xaxis: {
      type: 'datetime',
      categories: [],
      title: {
        text: 'Date'
      }
    },
    yaxis: {
      title: {
        text: 'Amount'
      }
    },
    title: {
      text: 'Expenses Over Time',
      align: 'left'
    }
  });
  const [chartSeries, setChartSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.sub;
      const response = await axios.get('http://localhost:8086/api/expensesByEmail', {
        params: {
          email: userEmail
        }
      });

      const expenses = response.data;

      const dates = expenses.map(expense => new Date(expense.expenseDate).getTime());
      const amounts = expenses.map(expense => expense.amount);

      setChartOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          type: 'datetime',
          categories: dates
        }
      }));

      setChartSeries([
        {
          name: 'Amount Spent',
          data: expenses.map(expense => ({
            x: new Date(expense.expenseDate).getTime(),
            y: expense.amount
          }))
        }
      ]);

      setLoading(false); // Data fetching complete

    } catch (error) {
      console.error('Error fetching expenses data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (chartType === 'line') {
      setChartOptions(prevOptions => ({
        ...prevOptions,
        stroke: {
          curve: 'smooth'
        }
      }));
    } else if (chartType === 'bar') {
      setChartOptions(prevOptions => ({
        ...prevOptions,
        plotOptions: {
          bar: {
            horizontal: false
          }
        }
      }));
    } else if (chartType === 'area') {
      setChartOptions(prevOptions => ({
        ...prevOptions,
        fill: {
          opacity: 0.3
        }
      }));
    }
  }, [chartType]);

  // Render loading state if data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <h5 className="card-title text-primary">Expenses Over Time</h5>
            </div>
            <div className="col-md-6">
              <select className="form-select" value={chartType} onChange={handleChartTypeChange}>
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="area">Area Chart</option>
              </select>
            </div>
          </div>
          <div className="chart">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type={chartType}
              height={350}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartWithCrosshair;