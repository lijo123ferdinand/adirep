import React, { useState } from 'react';
import UserProfile from '../components/UserProfile';
import ChartContainer from '../components/ChartContainer';
import AnalysisForm from '../components/AnalysisForm';
import ExpensesByDateRange from '../components/ExpensesByDateRange';

function AnalyticsPage() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
 

  return (
    <div>
      <h2>Expenses Analysis</h2>
      {/* <AnalysisForm 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleTransactionsUpdate={setTransactions} // Pass a function to update transactions */}
      {/* /> */}
      {/* <h2>expense within the date range</h2> */}
      <ExpensesByDateRange />
      <h2>total expense</h2>

      {/* <UserProfile startDate={startDate} endDate={endDate} transactions={transactions} /> */}
      <ChartContainer />
    </div>
  );
}

export default AnalyticsPage;
