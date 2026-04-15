import React from 'react';
import { Image, FolderOpen, Calendar } from 'lucide-react';

export default function MediaTable({ medias, onEdit, onDelete }) {
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
          {medias.map(media => (
            <tr key={media._id} className="hover:bg-base-200">
              <td>
                <div className="avatar">
                  <div className="w-12 h-12 rounded">
                    <img src={media.url} alt={media.title} />
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{media.title}</p>
                  <p className="text-sm text-base-content/60 line-clamp-1">
                    {media.description}
                  </p>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <span className="badge badge-outline capitalize">
                    {media.category}
                  </span>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4" />
                  {media.uploadDate}
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(media)}
                    className="btn btn-sm btn-info text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(media._id)}
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