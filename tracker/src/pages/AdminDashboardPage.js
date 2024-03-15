import UserChart from "../components/UserChart";
import UserList from "../components/UserList";

function AdminDashboardPage() {
  return (
    <div>
        <h2>Admin Dashboard</h2>
        <UserList />
        <UserChart />
    </div>
  );
}

export default AdminDashboardPage;
