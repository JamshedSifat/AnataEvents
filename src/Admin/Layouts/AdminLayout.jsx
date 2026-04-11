import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';

const AdminLayout = () => {
  return (
    <div className='flex bg-gray-50 min-h-screen'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className='flex-1'>
        {/* Header */}
        <Header />

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;