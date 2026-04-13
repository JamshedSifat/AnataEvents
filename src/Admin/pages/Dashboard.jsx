import React from 'react';
import StatsCard from '../Components/StatsCard';

const Dashboard = () => {
  const stats = [
    { icon: '🎉', title: 'Total Events', count: '125', color: 'text-blue-600' },
    { icon: '����', title: 'Bookings', count: '89', color: 'text-green-600' },
    { icon: '👥', title: 'Users', count: '245', color: 'text-purple-600' },
    { icon: '💰', title: 'Revenue', count: '৳2.5L', color: 'text-orange-600' },
  ];

  return (
    <div className='w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Events */}
        <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
          <h3 className='text-2xl font-bold text-gray-800 mb-4'>📅 Recent Events</h3>
          <div className='space-y-3'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition'>
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
          <button className='w-full mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm'>
            View All Events →
          </button>
        </div>

        {/* Recent Bookings */}
        <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
          <h3 className='text-2xl font-bold text-gray-800 mb-4'>🎫 Recent Bookings</h3>
          <div className='space-y-3'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition'>
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
          <button className='w-full mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm'>
            View All Bookings →
          </button>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-8'>
        {[
          { label: 'Total Revenue', value: '৳25,00,000', icon: '💰', color: 'from-green-400 to-green-600' },
          { label: 'Active Events', value: '45', icon: '🎯', color: 'from-blue-400 to-blue-600' },
          { label: 'Total Users', value: '1,245', icon: '👥', color: 'from-purple-400 to-purple-600' },
          { label: 'Pending Approvals', value: '12', icon: '⏳', color: 'from-orange-400 to-orange-600' },
        ].map((item, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${item.color} text-white p-6 rounded-lg shadow-md hover:shadow-lg transition`}>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm opacity-90 mb-1'>{item.label}</p>
                <p className='text-3xl font-bold'>{item.value}</p>
              </div>
              <span className='text-4xl'>{item.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;