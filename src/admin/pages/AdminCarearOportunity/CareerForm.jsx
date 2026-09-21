import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

export default function CareerForm({ job, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    responsibilities: '',
    status: 'active'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const DEPARTMENTS = [
    'Event Management',
    'Creative',
    'Sales & Marketing',
    'Media Production',
    'Digital Marketing',
    'Human Resources',
    'Operations',
    'Finance'
  ];

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        department: job.department,
        experience: job.experience,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements.join('\n'),
        responsibilities: job.responsibilities.join('\n'),
        status: job.status
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Job title is required');
      return;
    }

    if (!formData.department.trim()) {
      toast.error('Department is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = {
        title: formData.title,
        department: formData.department,
        experience: formData.experience,
        salary: formData.salary,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
        status: formData.status
      };

      await onSubmit(submitData);

      setFormData({
        title: '',
        department: '',
        experience: '',
        salary: '',
        description: '',
        requirements: '',
        responsibilities: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title & Department */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Job Title *</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., Event Manager"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Department *</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            disabled={isSubmitting}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Experience & Salary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Experience Required</span>
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., 2-3 years"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="label">
            <span className="label-text font-bold">Salary Range</span>
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., ৳30,000 - ৳50,000"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Job Description *</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full"
          placeholder="Enter job description"
          rows="4"
          disabled={isSubmitting}
        />
      </div>

      {/* Requirements */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Requirements</span>
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full font-mono text-sm"
          placeholder="One requirement per line"
          rows="3"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">Each line is one requirement</p>
      </div>

      {/* Responsibilities */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Responsibilities</span>
        </label>
        <textarea
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full font-mono text-sm"
          placeholder="One responsibility per line"
          rows="3"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">Each line is one responsibility</p>
      </div>

      {/* Status */}
      <div className="form-group">
        <label className="label">
          <span className="label-text font-bold">Status</span>
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="select select-bordered w-full"
          disabled={isSubmitting}
        >
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-6">
        <button
          type="submit"
          className="btn btn-primary flex-1 gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            job ? 'Update Job' : 'Post Job'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}