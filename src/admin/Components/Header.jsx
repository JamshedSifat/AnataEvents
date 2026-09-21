import React, { useContext } from 'react';
import { AuthContext } from '../../auth/Context/AuthContext';

const Header = () => {
  const { admin } = useContext(AuthContext);

  return (
    <div className='bg-white shadow-lg p-6 flex justify-between items-center ml-64'>
      <div>
        <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
        <p className='text-gray-600 text-sm mt-1'>Welcome back, {admin?.name}!</p>
      </div>

      <div className='flex items-center space-x-6'>
        {/* Notifications */}
        <button className='relative p-2 text-gray-600 hover:text-primary transition'>
          <span className='text-2xl'>🔔</span>
          <span className='absolute top-1 right-1 w-3 h-3 bg-red-600 rounded-full'></span>
        </button>

        {/* Profile */}
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold'>
            {admin?.name?.charAt(0)}
          </div>
          <div>
            <p className='font-semibold text-gray-800'>{admin?.name}</p>
            <p className='text-gray-600 text-xs'>{admin?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;