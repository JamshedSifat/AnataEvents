import React from 'react';
import { Star, Building2, Briefcase } from 'lucide-react';

export default function TestimonialTable({ testimonials, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Company</th>
            <th>Rating</th>
            <th>Event Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map(testimonial => (
            <tr key={testimonial._id} className="hover:bg-base-200">
              <td>
                <div className="avatar">
                  <div className="mask mask-circle w-10 h-10 ring ring-primary ring-offset-1">
                    <img src={testimonial.image} alt={testimonial.name} />
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <p className="font-bold text-base-content">{testimonial.name}</p>
                  <p className="text-sm text-base-content/60 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {testimonial.designation}
                  </p>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>{testimonial.company}</span>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </td>
              <td>
                <span className="badge badge-outline">
                  {testimonial.eventType}
                </span>
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(testimonial)}
                    className="btn btn-sm btn-info text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(testimonial._id)}
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