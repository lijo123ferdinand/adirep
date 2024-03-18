import UserList from "../components/UserList";
import { Link } from 'react-router-dom'; // Import Link component


function AdminDashboardPage() {
  return (
    <div>
        <Link to="/adminAnalytics">Go to Admin Analytics</Link>
        <h2>Admin Dashboard</h2>
        <UserList />

    </div>
  );
}

export default AdminDashboardPage;
