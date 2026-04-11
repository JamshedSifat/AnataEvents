import React from 'react';
import StatsCard from '../Components/StatsCard';

const Dashboard = () => {
  const stats = [
    { icon: '🎉', title: 'Total Events', count: '125', color: 'text-blue-600' },
    { icon: '📅', title: 'Bookings', count: '89', color: 'text-green-600' },
    { icon: '👥', title: 'Users', count: '245', color: 'text-purple-600' },
    { icon: '💰', title: 'Revenue', count: '৳2.5L', color: 'text-orange-600' },
  ];

  return (
    <div className='ml-64 p-8 bg-gray-50 min-h-screen'>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Events */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-2xl font-bold text-gray-800 mb-4'>Recent Events</h3>
          <div className='space-y-3'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                <div>
                  <p className='font-semibold text-gray-800'>Corporate Event {item}</p>
                  <p className='text-gray-600 text-sm'>2024-01-{10 + item}</p>
                </div>
                <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-2xl font-bold text-gray-800 mb-4'>Recent Bookings</h3>
          <div className='space-y-3'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                <div>
                  <p className='font-semibold text-gray-800'>Booking #{1000 + item}</p>
                  <p className='text-gray-600 text-sm'>John Doe</p>
                </div>
                <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold'>
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;