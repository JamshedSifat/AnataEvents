import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function CareerOpportunities() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    coverLetter: '',
    expectedSalary: '',
    joinDate: '',
    agreement: false
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    try {
      const savedJobs = localStorage.getItem('careerJobs');
      if (savedJobs) {
        const parsedJobs = JSON.parse(savedJobs);
        setJobs(parsedJobs.filter(job => job.status === 'active'));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fullName) {
      toast.error('Full name required');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('Valid email required');
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Valid phone required');
      return;
    }
    if (!formData.coverLetter) {
      toast.error('Cover letter required');
      return;
    }
    if (!formData.agreement) {
      toast.error('Agree to terms first');
      return;
    }

    try {
      // Save application
      const applications = JSON.parse(localStorage.getItem('careerApplications') || '[]');
      
      const newApplication = {
        _id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        jobTitle: selectedJob.title,
        experience: formData.experience,
        skills: formData.skills,
        coverLetter: formData.coverLetter,
        expectedSalary: formData.expectedSalary,
        joinDate: formData.joinDate,
        status: 'pending',
        appliedAt: new Date().toISOString()
      };

      applications.push(newApplication);
      localStorage.setItem('careerApplications', JSON.stringify(applications));

      toast.success('✓ Application submitted successfully!');
      
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        experience: '',
        skills: '',
        coverLetter: '',
        expectedSalary: '',
        joinDate: '',
        agreement: false
      });
      setShowForm(false);
      setSelectedJob(null);
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (showForm && selectedJob) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          
          <button
            onClick={() => {
              setShowForm(false);
              setSelectedJob(null);
            }}
            className="text-blue-600 font-bold mb-4 hover:text-blue-800"
          >
            ← Back to Jobs
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Application for {selectedJob.title}
            </h1>
            <p className="text-gray-600">{selectedJob.department}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block font-bold mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1XXXXXXXXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Key Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="List your relevant skills..."
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Cover Letter *</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Tell us why you're a great fit for this position..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Expected Salary (Monthly)</label>
              <input
                type="text"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                placeholder="৳30,000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Earliest Join Date</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                className="w-4 h-4 mr-3 cursor-pointer"
              />
              <label className="cursor-pointer text-gray-700">
                I confirm that the information provided is accurate
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedJob(null);
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Career Opportunities</h1>
          <p className="text-lg text-gray-600">
            Join AnantaEvents and build an amazing career
          </p>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div key={job._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>
                  <p className="text-green-100">{job.department}</p>
                </div>

                <div className="p-6">
                  <div className="mb-4 space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-bold">Experience:</span> {job.experience}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-bold">Salary:</span> {job.salary}
                    </p>
                  </div>

                  <p className="text-gray-700 mb-6">{job.description}</p>

                  <button
                    onClick={() => handleApplyClick(job)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-lg text-gray-600">No job postings available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}