import { Bell, User, Settings } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../auth/Context/AuthContext';

export default function AdminHeader() {
  const { admin } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back!</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-purple-600">
          <Bell size={24} />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Settings */}
        <button className="text-gray-600 hover:text-purple-600">
          <Settings size={24} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {admin?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-800">{admin?.name || 'Admin'}</p>
            <p className="text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}