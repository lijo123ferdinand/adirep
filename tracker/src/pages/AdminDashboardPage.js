import React from 'react';
import UserList from '../components/UserList';
import UserChart from '../components/UserChart';

function AdminDashboardPage() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="row">
        <div className="col-md-8" style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}> {/* UserList takes 60% of the page width */}
          <UserList />
        </div>
        <div className="col-md-4"> {/* UserChart takes 40% of the page width */}
          <UserChart />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
