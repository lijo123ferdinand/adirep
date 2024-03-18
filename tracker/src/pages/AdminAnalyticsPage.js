import UserChart from "../components/UserChart";
import { Link } from 'react-router-dom'; // Import Link component


function AdminAnalyticsPage() {
  return (
    <div>
        <h2>Admin Dashboard</h2>
        <UserChart />
        <Link to="/admin">Go to Admin Analytics</Link>

    </div>
  );
}

export default AdminAnalyticsPage;
