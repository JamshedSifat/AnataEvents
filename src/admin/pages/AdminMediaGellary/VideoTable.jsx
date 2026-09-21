import React from 'react';
import { Play, FolderOpen, Calendar } from 'lucide-react';

export default function VideoTable({ videos, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Category</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map(video => (
            <tr key={video._id} className="hover:bg-base-200">
              <td>
                <div className="w-16 h-12 rounded overflow-hidden bg-black flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{video.title}</p>
                  <p className="text-sm text-base-content/60 line-clamp-1">
                    {video.description}
                  </p>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <span className="badge badge-outline capitalize">
                    {video.category}
                  </span>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4" />
                  {video.uploadDate}
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(video)}
                    className="btn btn-sm btn-info text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(video._id)}
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