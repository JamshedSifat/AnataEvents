import React from 'react';

export default function ServiceTable({ services, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Icon</th>
            <th>Title</th>
            <th>Features</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service._id} className="hover:bg-base-200">
              <td>
                <div className="text-3xl">{service.icon}</div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{service.title}</p>
                  <p className="text-sm text-base-content/60 line-clamp-1">
                    {service.description}
                  </p>
                </div>
              </td>
              <td>
                <div className="badge badge-sm gap-1">
                  {service.features.length}
                </div>
              </td>
              <td>
                <div className={`badge ${
                  service.status === 'active'
                    ? 'badge-success'
                    : 'badge-warning'
                }`}>
                  {service.status === 'active' ? 'Active' : 'Inactive'}
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(service)}
                    className="btn btn-sm btn-info text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(service._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}