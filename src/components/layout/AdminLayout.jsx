import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-layout__content">
        <div className="admin-topbar">
          <div>
            <p>Signed in as {user?.email}</p>
          </div>

          <button type="button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
}