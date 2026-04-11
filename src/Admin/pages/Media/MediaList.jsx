import React, { useState } from 'react';

const MediaList = () => {
  const [mediaItems, setMediaItems] = useState([
    { id: 1, name: 'Event Photo 1', type: 'Image', size: '2.5 MB', uploadDate: '2024-01-10' },
    { id: 2, name: 'Event Video 1', type: 'Video', size: '125 MB', uploadDate: '2024-01-12' },
    { id: 3, name: 'Event Photo 2', type: 'Image', size: '3.2 MB', uploadDate: '2024-01-15' },
  ]);

  const handleUpload = () => {
    alert('Upload functionality would be implemented here');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this media?')) {
      setMediaItems(mediaItems.filter(m => m.id !== id));
    }
  };

  return (
    <div className='ml-64 p-8 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Media Management</h2>
        <button
          onClick={handleUpload}
          className='bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-bold transition'
        >
          + Upload Media
        </button>
      </div>

      {/* Table */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-primary text-white'>
            <tr>
              <th className='px-6 py-4 text-left'>Media Name</th>
              <th className='px-6 py-4 text-left'>Type</th>
              <th className='px-6 py-4 text-left'>Size</th>
              <th className='px-6 py-4 text-left'>Upload Date</th>
              <th className='px-6 py-4 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mediaItems.map((media) => (
              <tr key={media.id} className='border-b hover:bg-gray-50 transition'>
                <td className='px-6 py-4 font-semibold text-gray-800'>{media.name}</td>
                <td className='px-6 py-4 text-gray-600'>{media.type}</td>
                <td className='px-6 py-4 text-gray-600'>{media.size}</td>
                <td className='px-6 py-4 text-gray-600'>{media.uploadDate}</td>
                <td className='px-6 py-4 text-center space-x-2'>
                  <button className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition'>
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(media.id)}
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

export default MediaList;