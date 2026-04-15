import React, { useState } from 'react';
import { Outlet } from 'react-router';
import AdminSidebar from './AdminSidebar';


const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      {/* Main content - Sidebar এর পর শুরু হবে */}
      <main className="flex-1 ml-64 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;