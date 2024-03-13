import React, { useState } from 'react';
import ChartContainer from '../components/ChartContainer';
// import ExpensesByDateRange from '../components/ExpensesByDateRange';

function AnalyticsPage() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  // const [transactions, setTransactions] = useState([]);

  return (
    <div>
      <h2>Expenses Analysis</h2>
      {/* <ExpensesByDateRange /> */}
      <ChartContainer />
    </div>
  );
}

export default AnalyticsPage;