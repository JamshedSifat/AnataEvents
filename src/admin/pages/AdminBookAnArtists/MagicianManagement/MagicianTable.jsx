import React from 'react';
import { Star, MapPin, Wand2 } from 'lucide-react';

export default function MagicianTable({ magicians, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Location</th>
            <th>Rating</th>
            <th>Specialties</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {magicians.map(magician => (
            <tr key={magician._id} className="hover:bg-base-200">
              <td>
                <div className="avatar">
                  <div className="mask mask-circle w-10 h-10">
                    <img src={magician.image} alt={magician.name} />
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{magician.name}</p>
                  <p className="text-sm text-base-content/60 line-clamp-1">
                    {magician.famous_show}
                  </p>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  {magician.city}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{magician.rating}</span>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {magician.genres.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="badge badge-sm badge-primary">
                      {genre}
                    </span>
                  ))}
                  {magician.genres.length > 2 && (
                    <span className="badge badge-sm">+{magician.genres.length - 2}</span>
                  )}
                </div>
              </td>
              <td>
                <div className={`badge ${
                  magician.tour_status === 'Active'
                    ? 'badge-success'
                    : 'badge-warning'
                }`}>
                  {magician.tour_status}
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(magician)}
                    className="btn btn-sm btn-info text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(magician._id)}
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