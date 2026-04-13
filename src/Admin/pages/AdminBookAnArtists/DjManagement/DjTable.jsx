import React from 'react';
import { Star, Music } from 'lucide-react';

export default function DjTable({ djs, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Genre</th>
            <th>Location</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {djs.map(dj => (
            <tr key={dj._id} className="hover:bg-base-200">
              <td>
                <div className="avatar">
                  <div className="mask mask-circle w-10 h-10">
                    <img src={dj.image} alt={dj.name} />
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{dj.name}</p>
                  <p className="text-sm text-base-content/60 line-clamp-1">
                    {dj.famous_for}
                  </p>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4 text-primary" />
                  <span className="badge badge-outline">{dj.genre}</span>
                </div>
              </td>
              <td>
                <p className="text-sm">{dj.city}, {dj.country}</p>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{dj.rating}</span>
                </div>
              </td>
              <td>
                <div className={`badge ${
                  dj.status === 'Active'
                    ? 'badge-success'
                    : 'badge-warning'
                }`}>
                  {dj.status}
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(dj)}
                    className="btn btn-sm btn-info text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(dj._id)}
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