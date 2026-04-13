import React from 'react';
import { Star, MapPin, Music } from 'lucide-react';

export default function SingerTable({ singers, onEdit, onDelete }) {
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
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {singers.map(singer => (
            <tr key={singer._id} className="hover:bg-base-200">
              <td>
                <div className="avatar">
                  <div className="mask mask-circle w-10 h-10">
                    <img src={singer.image} alt={singer.name} />
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{singer.name}</p>
                  <p className="text-sm text-base-content/60">{singer.experience}</p>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4 text-primary" />
                  <span className="badge badge-outline">{singer.genre}</span>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  {singer.location}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{singer.rating}</span>
                </div>
              </td>
              <td>
                <div className={`badge ${
                  singer.availability === 'Available'
                    ? 'badge-success'
                    : 'badge-warning'
                }`}>
                  {singer.availability}
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(singer)}
                    className="btn btn-sm btn-info text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(singer._id)}
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