import UserChart from "../components/UserChart";
import UserList from "../components/UserList";
import { Link } from 'react-router-dom'; // Import Link component


function AdminDashboardPage() {
  return (
    <div>
        <h2>Admin Dashboard</h2>
        <UserList />
        <Link to="/adminAnalytics">Go to Admin Analytics</Link>

    </div>
  );
}

export default AdminDashboardPage;
