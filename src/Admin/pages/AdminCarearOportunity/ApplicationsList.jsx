import React from 'react';
import { FileText, Mail, Phone, Trash2, Check, X } from 'lucide-react';

export default function ApplicationsList({ applications, onUpdateStatus, onDelete }) {
  if (applications.length === 0) {
    return (
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body text-center py-12">
          <p className="text-base-content/60 text-lg">No applications yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map(app => (
        <div key={app._id} className="card bg-white shadow-md border border-base-300">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left - Applicant Info */}
              <div>
                <h3 className="font-bold text-lg text-base-content">{app.fullName}</h3>
                <p className="text-sm text-base-content/60 mt-1">{app.jobTitle}</p>
                <div className="space-y-1 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${app.email}`} className="text-primary hover:underline">
                      {app.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{app.phone}</span>
                  </div>
                </div>
              </div>

              {/* Middle - Application Details */}
              <div className="text-sm">
                <p className="text-base-content/60 mb-2">
                  <span className="font-bold">Experience:</span> {app.experience} years
                </p>
                <p className="text-base-content/60 mb-2">
                  <span className="font-bold">Expected Salary:</span> {app.expectedSalary}
                </p>
                <p className="text-base-content/60">
                  <span className="font-bold">Join Date:</span> {app.joinDate}
                </p>
                <div className="mt-3">
                  <span className={`badge ${
                    app.status === 'approved' ? 'badge-success' :
                    app.status === 'rejected' ? 'badge-error' :
                    'badge-warning'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>

              {/* Right - Actions */}
              <div className="flex flex-col gap-2 justify-between">
                <div>
                  <p className="text-xs text-base-content/60 mb-2">Cover Letter:</p>
                  <p className="text-sm line-clamp-3 text-base-content/80">
                    {app.coverLetter}
                  </p>
                </div>
                <div className="flex gap-2">
                  {app.status !== 'approved' && (
                    <button
                      onClick={() => onUpdateStatus(app._id, 'approved')}
                      className="btn btn-sm btn-success text-white gap-1 flex-1"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  )}
                  {app.status !== 'rejected' && (
                    <button
                      onClick={() => onUpdateStatus(app._id, 'rejected')}
                      className="btn btn-sm btn-error text-white gap-1 flex-1"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(app._id)}
                    className="btn btn-sm btn-ghost"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}