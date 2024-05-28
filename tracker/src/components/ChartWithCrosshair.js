import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
// import './ChartWithCrosshair.css';

const ChartWithCrosshair = () => {
  const [chartType, setChartType] = useState('line');
  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: 'basic-line',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  });
  const [chartSeries, setChartSeries] = useState([
    {
      name: 'Series 1',
      data: [30, 40, 45, 50, 49, 60, 70, 91, 125, 100, 80, 70]
    }
  ]);

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  useEffect(() => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      chart: {
        ...prevOptions.chart,
        animations: {
          enabled: false
        }
      }
    }));
  }, [chartType]);

  useEffect(() => {
    if (chartType === 'line') {
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        chart: {
          ...prevOptions.chart,
          toolbar: {
            show: false
          }
        },
        stroke: {
          curve: 'smooth'
        }
      }));
    } else if (chartType === 'bar') {
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        chart: {
          ...prevOptions.chart,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        }
      }));
    }
  }, [chartType]);

  useEffect(() => {
    const chart = ApexCharts.exec('basic-line', 'updateOptions', chartOptions);
  }, [chartOptions]);

  return (
    <div className="chart-container">
      <div className="chart-type-dropdown">
        <select value={chartType} onChange={handleChartTypeChange}>
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
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
  );
};

export default ChartWithCrosshair;
