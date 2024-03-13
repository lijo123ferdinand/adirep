import React from 'react';

const ChartTypeDropdown = ({ onChange }) => {
  const handleSelectChange = (e) => {
    const selectedType = e.target.value;
    onChange(selectedType);
  };

  return (
    <div>
      <label htmlFor="chartType">Select Chart Type:</label>
      <select id="chartType" onChange={handleSelectChange}>
        <option value="line">Line Chart</option>
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>
        {/* Add more chart types as needed */}
      </select>
    </div>
  );
};

export default ChartTypeDropdown;
