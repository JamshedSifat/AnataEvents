import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { Briefcase, FileText } from 'lucide-react';
import CareerTable from './CareerTable';
import CareerForm from './CareerForm';
import ApplicationsList from './ApplicationsList';

export default function CareerManagement() {
  const [activeTab, setActiveTab] = useState('jobs'); // jobs, applications
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedJobs = localStorage.getItem('careerJobs');
      const savedApplications = localStorage.getItem('careerApplications');

      if (savedJobs) {
        setJobs(JSON.parse(savedJobs));
      } else {
        const sampleJobs = [
          {
            _id: '1',
            title: 'Event Manager',
            department: 'Event Management',
            experience: '2-3 years',
            salary: '৳30,000 - ৳50,000',
            description: 'Looking for an experienced event manager to handle corporate events and large-scale functions.',
            requirements: ['Event planning experience', 'Team management', 'Client communication'],
            responsibilities: ['Manage event planning', 'Client coordination', 'Team supervision'],
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
          }
        ];
        setJobs(sampleJobs);
        localStorage.setItem('careerJobs', JSON.stringify(sampleJobs));
      }

      if (savedApplications) {
        setApplications(JSON.parse(savedApplications));
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };

  const saveJobsToStorage = (updatedJobs) => {
    try {
      localStorage.setItem('careerJobs', JSON.stringify(updatedJobs));
    } catch (error) {
      console.error('Error saving jobs:', error);
      toast.error('Failed to save jobs');
    }
  };

  const saveApplicationsToStorage = (updatedApplications) => {
    try {
      localStorage.setItem('careerApplications', JSON.stringify(updatedApplications));
    } catch (error) {
      console.error('Error saving applications:', error);
      toast.error('Failed to save applications');
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      setLoading(true);
      
      const newJob = {
        ...jobData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedJobs = [...jobs, newJob];
      setJobs(updatedJobs);
      saveJobsToStorage(updatedJobs);
      
      toast.success('Job posted successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (id, jobData) => {
    try {
      setLoading(true);
      
      const updatedJobs = jobs.map(job =>
        job._id === id ? { ...jobData, _id: id } : job
      );
      
      setJobs(updatedJobs);
      saveJobsToStorage(updatedJobs);
      
      toast.success('Job updated successfully!');
      setSelectedJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        setLoading(true);
        
        const updatedJobs = jobs.filter(job => job._id !== id);
        setJobs(updatedJobs);
        saveJobsToStorage(updatedJobs);
        
        toast.success('Job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateApplicationStatus = (appId, status) => {
    try {
      const updatedApplications = applications.map(app =>
        app._id === appId ? { ...app, status: status } : app
      );
      
      setApplications(updatedApplications);
      saveApplicationsToStorage(updatedApplications);
      
      toast.success(`Application ${status}!`);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  const handleDeleteApplication = (appId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const updatedApplications = applications.filter(app => app._id !== appId);
        setApplications(updatedApplications);
        saveApplicationsToStorage(updatedApplications);
        
        toast.success('Application deleted!');
      } catch (error) {
        console.error('Error deleting application:', error);
        toast.error('Failed to delete application');
      }
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter(app =>
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-base-content">Career Management</h1>
          <p className="text-base-content/60 mt-2">
            Active Jobs: {jobs.length} | Applications: {applications.length}
          </p>
        </div>
        {activeTab === 'jobs' && (
          <button
            onClick={() => {
              setSelectedJob(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary gap-2"
            disabled={loading}
          >
            <span>+</span>
            Post New Job
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`tab ${activeTab === 'jobs' ? 'tab-active' : ''}`}
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Job Postings
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`tab ${activeTab === 'applications' ? 'tab-active' : ''}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Applications
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={activeTab === 'jobs' ? 'Search by job title or department...' : 'Search by applicant name or job title...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          disabled={loading}
        />
      </div>

      {/* Job Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Post New Job</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <CareerForm
                onSubmit={handleCreateJob}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Job</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <CareerForm
                job={selectedJob}
                onSubmit={(data) => handleUpdateJob(selectedJob._id, data)}
                onCancel={() => setSelectedJob(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'jobs' ? (
        <div className="card bg-base-100 shadow-lg border border-base-300">
          {loading ? (
            <div className="card-body flex items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filteredJobs.length > 0 ? (
            <CareerTable
              jobs={filteredJobs}
              onEdit={setSelectedJob}
              onDelete={handleDeleteJob}
            />
          ) : (
            <div className="card-body text-center py-12">
              <p className="text-base-content/60 text-lg">No job postings found</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary mt-4"
              >
                Post First Job
              </button>
            </div>
          )}
        </div>
      ) : (
        <ApplicationsList
          applications={filteredApplications}
          onUpdateStatus={handleUpdateApplicationStatus}
          onDelete={handleDeleteApplication}
        />
      )}
    </div>
  );
}