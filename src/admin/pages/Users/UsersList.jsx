import React, { useState } from 'react';

const UsersList = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '01813340400', joinDate: '2024-01-10', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '01813340401', joinDate: '2024-01-12', status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '01813340402', joinDate: '2024-01-15', status: 'Inactive' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='ml-64 p-8 bg-gray-50 min-h-screen'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8'>Users Management</h2>

      {/* Search Bar */}
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search users by name or email...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
        />
      </div>

      {/* Table */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-primary text-white'>
            <tr>
              <th className='px-6 py-4 text-left'>Name</th>
              <th className='px-6 py-4 text-left'>Email</th>
              <th className='px-6 py-4 text-left'>Phone</th>
              <th className='px-6 py-4 text-left'>Join Date</th>
              <th className='px-6 py-4 text-left'>Status</th>
              <th className='px-6 py-4 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className='border-b hover:bg-gray-50 transition'>
                <td className='px-6 py-4 font-semibold text-gray-800'>{user.name}</td>
                <td className='px-6 py-4 text-gray-600'>{user.email}</td>
                <td className='px-6 py-4 text-gray-600'>{user.phone}</td>
                <td className='px-6 py-4 text-gray-600'>{user.joinDate}</td>
                <td className='px-6 py-4'>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className='px-6 py-4 text-center space-x-2'>
                  <button className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition'>
                    View
                  </button>
                  <button className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition'>
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;