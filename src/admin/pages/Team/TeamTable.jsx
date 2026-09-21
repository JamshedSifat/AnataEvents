import React from 'react';
import { Mail, Phone, Briefcase, Edit, Trash2 } from 'lucide-react';

export default function TeamTable({ members, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Role</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member._id} className="hover:bg-base-200">
              <td>
                <div className="avatar">
                  <div className="mask mask-circle w-12 h-12 ring ring-primary ring-offset-1">
                    <img src={member.image} alt={member.name} />
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{member.name}</p>
                  <p className="text-sm text-base-content/60">
                    {member.description ? member.description.substring(0, 30) + '...' : 'No description'}
                  </p>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>{member.role}</span>
                </div>
              </td>
              <td>
                <div className="space-y-1 text-sm">
                  {member.email && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-3 h-3" />
                      {member.phone}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(member)}
                    className="btn btn-sm btn-info text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(member._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <Trash2 className="w-4 h-4" />
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