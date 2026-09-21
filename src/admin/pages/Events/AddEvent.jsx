import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const AddEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    capacity: '',
    status: 'Pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event Added:', formData);
    alert('Event added successfully!');
    navigate('/admin/events');
  };

  return (
    <div className='ml-64 p-8 bg-gray-50 min-h-screen'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8'>Add New Event</h2>

      <div className='bg-white p-8 rounded-lg shadow-md max-w-2xl'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Event Name */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Event Name *</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter event name'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Event Date *</label>
            <input
              type='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Location *</label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleChange}
              placeholder='Enter location'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Description</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Event description'
              rows='4'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            ></textarea>
          </div>

          {/* Capacity */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Capacity *</label>
            <input
              type='number'
              name='capacity'
              value={formData.capacity}
              onChange={handleChange}
              placeholder='Number of attendees'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Status</label>
            <select
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            >
              <option>Active</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className='flex space-x-4 pt-4'>
            <button
              type='submit'
              className='flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-lg font-bold transition'
            >
              Add Event
            </button>
            <button
              type='button'
              onClick={() => navigate('/admin/events')}
              className='flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-bold transition'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;