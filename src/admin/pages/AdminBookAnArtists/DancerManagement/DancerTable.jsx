import React from 'react';
import { Star } from 'lucide-react';

export default function DancerTable({ dancers, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Category</th>
            <th>Rating</th>
            <th>Styles</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dancers.map(dancer => (
            <tr key={dancer._id} className="hover:bg-base-200">
              <td>
                <div className="avatar">
                  <div className="mask mask-circle w-10 h-10">
                    <img src={dancer.image} alt={dancer.name} />
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{dancer.name}</p>
                  <p className="text-sm text-base-content/60 line-clamp-1">
                    {dancer.famous_for}
                  </p>
                </div>
              </td>
              <td>
                <span className="badge badge-outline">{dancer.category}</span>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{dancer.rating}</span>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {dancer.styles.slice(0, 2).map((style, idx) => (
                    <span key={idx} className="badge badge-sm badge-primary">
                      {style}
                    </span>
                  ))}
                  {dancer.styles.length > 2 && (
                    <span className="badge badge-sm">+{dancer.styles.length - 2}</span>
                  )}
                </div>
              </td>
              <td>
                <div className={`badge ${
                  dancer.status === 'Active'
                    ? 'badge-success'
                    : 'badge-warning'
                }`}>
                  {dancer.status}
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(dancer)}
                    className="btn btn-sm btn-info text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(dancer._id)}
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