import React, { useContext } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../../Auth/Context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { icon: '����', name: 'Dashboard', path: '/admin/dashboard' },
    { icon: '🎉', name: 'Events', path: '/admin/events' },
    { icon: '👥', name: 'Users', path: '/admin/users' },
    { icon: '📅', name: 'Bookings', path: '/admin/bookings' },
    { icon: '📸', name: 'Media', path: '/admin/media' },
    { icon: '🖼️', name: 'Gallery', path: '/admin/gallery' },
    { icon: '⚙️', name: 'Settings', path: '/admin/settings' },
    { path: '/admin/dashboard/djs', label: 'DJs', icon: Package },
    { path: '/admin/dashboard/singers', label: 'Singers', icon: Package },
  ];

  return (
    <div className='w-64 bg-primary text-white h-screen shadow-lg fixed left-0 top-0 overflow-y-auto'>
      {/* Logo */}
      <div className='p-6 border-b border-primary/30'>
        <h2 className='text-3xl font-bold'>Ananta</h2>
        <p className='text-primary/80 text-sm'>Admin Panel</p>
      </div>

      {/* Menu */}
      <nav className='p-4 space-y-2'>
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-white text-primary font-bold'
                  : 'text-white hover:bg-primary/80'
              }`
            }
          >
            <span className='text-xl'>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className='p-4 border-t border-primary/30 absolute bottom-0 w-full'>
        <button
          onClick={logout}
          className='w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-all duration-300'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;