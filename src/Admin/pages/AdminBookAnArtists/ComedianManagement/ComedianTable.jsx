import React from 'react';
import { Star, MapPin, Tv } from 'lucide-react';

export default function ComedianTable({ comedians, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Location</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comedians.map(comedian => (
            <tr key={comedian._id} className="hover:bg-base-200">
              <td>
                <div className="avatar">
                  <div className="mask mask-circle w-10 h-10">
                    <img src={comedian.image} alt={comedian.name} />
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{comedian.name}</p>
                  <p className="text-sm text-base-content/60">{comedian.famous_show}</p>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  {comedian.city}, {comedian.country}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{comedian.rating}</span>
                </div>
              </td>
              <td>
                <div className={`badge ${
                  comedian.tour_status === 'Active'
                    ? 'badge-success'
                    : 'badge-warning'
                }`}>
                  {comedian.tour_status}
                </div>
              </td>
              <td>
                <span className="font-bold text-primary">₹{comedian.price.toLocaleString()}</span>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(comedian)}
                    className="btn btn-sm btn-info text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comedian._id)}
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