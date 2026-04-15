import React from 'react';
import { Edit, Trash2, Briefcase } from 'lucide-react';

export default function CareerTable({ jobs, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Job Title</th>
            <th>Department</th>
            <th>Experience</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job._id} className="hover:bg-base-200">
              <td>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{job.title}</span>
                </div>
              </td>
              <td>{job.department}</td>
              <td className="text-sm">{job.experience}</td>
              <td className="text-sm font-semibold">{job.salary}</td>
              <td>
                <div className={`badge ${
                  job.status === 'active' ? 'badge-success' :
                  job.status === 'closed' ? 'badge-error' :
                  'badge-warning'
                }`}>
                  {job.status}
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(job)}
                    className="btn btn-sm btn-info text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(job._id)}
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