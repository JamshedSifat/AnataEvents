import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Package, Users, Image, LogOut, MessageSquare, Briefcase } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../Auth/Context/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    // { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/dashboard/services', label: 'Services', icon: Package },
    // { path: '/admin/dashboard/events', label: 'Events', icon: Package },
    // { path: '/admin/dashboard/users', label: 'Users', icon: Users },
    { path: '/admin/dashboard/comedians', label: 'Comedians', icon: Package },
    { path: '/admin/dashboard/dancers', label: 'Dancers', icon: Package },
    { path: '/admin/dashboard/magicians', label: 'Magicians', icon: Package },
    { path: '/admin/dashboard/singers', label: 'Singers', icon: Package },
    { path: '/admin/dashboard/gallery', label: 'Gallery', icon: Image },
    { path: '/admin/dashboard/videos', label: 'Videos', icon: Package },
    { path: '/admin/dashboard/testimonials', label: 'Testimonials', icon: MessageSquare },
    { path: '/admin/dashboard/team', label: 'Team Members', icon: Users },
    { path: '/admin/dashboard/careers', label: 'Career Opportunities', icon: Briefcase },
    { path: '/admin/dashboard/blogs', label: 'Blogs', icon: Briefcase },
    { path: '/admin/dashboard/portfolio', label: 'Protfolio', icon: Briefcase },
    { path: '/admin/dashboard/vendors', label: 'Vendors', icon: Briefcase },
     
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 h-screen flex flex-col bg-primary text-white shadow-lg fixed left-0 top-0">
      
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <h1 className="text-2xl font-bold">Ananta Admin</h1>
        <p className="text-sm text-white/70">Event Management</p>
      </div>

      {/* Menu - Scrollable */}
      <nav className="mt-6 space-y-2 px-4 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                active
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout - Fixed at bottom */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition text-white w-full font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}