import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../auth/Context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-100'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4'></div>
          <p className='text-xl text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to='/admin/login' replace />;
  }

  return children;
};

export default ProtectedRoute;