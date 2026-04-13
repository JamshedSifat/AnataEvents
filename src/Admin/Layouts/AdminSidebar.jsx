import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Package, Users, Image, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../Auth/Context/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/dashboard/services', label: 'Services', icon: Package },
    { path: '/admin/dashboard/events', label: 'Events', icon: Package },
    { path: '/admin/dashboard/users', label: 'Users', icon: Users },
    { path: '/admin/dashboard/comedians', label: 'Comedians', icon: Package },
    { path: '/admin/dashboard/dancers', label: 'Dancers', icon: Package },
    { path: '/admin/dashboard/magicians', label: 'Magicians', icon: Package },
    { path: '/admin/dashboard/singers', label: 'Singers', icon: Package },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-purple-700">
        <h1 className="text-2xl font-bold">Anata Admin</h1>
        <p className="text-sm text-purple-200">Event Management</p>
      </div>

      {/* Menu */}
      <nav className="mt-6 space-y-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-purple-700 text-white'
                  : 'text-purple-100 hover:bg-purple-700'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition text-white"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}