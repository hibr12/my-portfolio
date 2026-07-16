import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/admin/projects', label: 'Projects', icon: 'folder' },
  { to: '/admin/skills', label: 'Skills', icon: 'tool' },
  { to: '/admin/certificates', label: 'Certificates', icon: 'award' },
  { to: '/admin/contact', label: 'Messages', icon: 'mail' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'chart' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <NavLink to="/admin" className="admin-sidebar__brand">H</NavLink>
          <span className="admin-sidebar__title">Admin Panel</span>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__avatar">
              {user?.name?.charAt(0) || 'A'}
            </span>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{user?.name || 'Admin'}</span>
              <span className="admin-sidebar__user-role">{user?.role || 'admin'}</span>
            </div>
          </div>
          <button
            className="admin-sidebar__logout"
            type="button"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
