import React, { useState } from 'react';
import { Link } from 'react-router';

const EventsList = () => {
  const [events, setEvents] = useState([
    { id: 1, name: 'Corporate Event', date: '2024-01-15', status: 'Active', attendees: 150 },
    { id: 2, name: 'Wedding', date: '2024-01-20', status: 'Active', attendees: 250 },
    { id: 3, name: 'Conference', date: '2024-02-05', status: 'Pending', attendees: 100 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className='ml-64 p-8 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Events Management</h2>
        <Link
          to='/admin/events/add'
          className='bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-bold transition'
        >
          + Add Event
        </Link>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search events...'
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
              <th className='px-6 py-4 text-left'>Event Name</th>
              <th className='px-6 py-4 text-left'>Date</th>
              <th className='px-6 py-4 text-left'>Attendees</th>
              <th className='px-6 py-4 text-left'>Status</th>
              <th className='px-6 py-4 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className='border-b hover:bg-gray-50 transition'>
                <td className='px-6 py-4 font-semibold text-gray-800'>{event.name}</td>
                <td className='px-6 py-4 text-gray-600'>{event.date}</td>
                <td className='px-6 py-4 text-gray-600'>{event.attendees}</td>
                <td className='px-6 py-4'>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className='px-6 py-4 text-center space-x-2'>
                  <button className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition'
                  >
                    Delete
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

export default EventsList;