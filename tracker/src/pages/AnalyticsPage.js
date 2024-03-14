import ExpensesByDateRange from '../components/ExpensesByDateRange';


function AnalyticsPage() {
  return (
    <div className="card-container p-4">
      <div>
        <h2>Expenses Analysis</h2>
        <ExpensesByDateRange />
      </div>
    </div>
  );
}

export default AnalyticsPage;
