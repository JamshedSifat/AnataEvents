// File: src/Admin/Pages/TalentHunt/AdminTalentHunt.jsx (Complete - Video Removed)
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Eye, X, Mail, Phone, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';

const AdminTalentHunt = () => {
  const [talents, setTalents] = useState([]);
  const [filteredTalents, setFilteredTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadTalents();
  }, []);

  const loadTalents = () => {
    try {
      setLoading(true);
      let data = [];
      const savedTalents = localStorage.getItem('talents');
      
      if (savedTalents) {
        data = JSON.parse(savedTalents);
      }

      setTalents(data);
      setFilteredTalents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading talents:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = talents;

    if (filterStatus === 'approved') {
      filtered = filtered.filter(talent => talent.approvalStatus === 'approved');
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(talent => talent.approvalStatus === 'pending');
    } else if (filterStatus === 'rejected') {
      filtered = filtered.filter(talent => talent.approvalStatus === 'rejected');
    }

    if (searchTerm) {
      filtered = filtered.filter(talent =>
        talent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.talentCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTalents(filtered);
  }, [searchTerm, talents, filterStatus]);

  const handleViewDetails = (talent) => {
    setSelectedTalent(talent);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (id) => {
    if (window.confirm('Approve this talent?')) {
      const updatedTalents = talents.map(t =>
        t._id === id ? { 
          ...t, 
          approvalStatus: 'approved',
          approvedDate: new Date().toISOString()
        } : t
      );
      localStorage.setItem('talents', JSON.stringify(updatedTalents));
      setTalents(updatedTalents);
      setSelectedTalent(updatedTalents.find(t => t._id === id));
      alert('✓ Talent approved!');
    }
  };

  const handleReject = (id) => {
    const reason = prompt('Enter reason for rejection (optional):');
    if (reason !== null) {
      const updatedTalents = talents.map(t =>
        t._id === id ? { 
          ...t, 
          approvalStatus: 'rejected',
          rejectionReason: reason,
          rejectionDate: new Date().toISOString()
        } : t
      );
      localStorage.setItem('talents', JSON.stringify(updatedTalents));
      setTalents(updatedTalents);
      setSelectedTalent(updatedTalents.find(t => t._id === id));
      alert('✗ Talent rejected!');
    }
  };

  const handlePending = (id) => {
    if (window.confirm('Move back to pending?')) {
      const updatedTalents = talents.map(t =>
        t._id === id ? { 
          ...t, 
          approvalStatus: 'pending',
          rejectionReason: ''
        } : t
      );
      localStorage.setItem('talents', JSON.stringify(updatedTalents));
      setTalents(updatedTalents);
      setSelectedTalent(updatedTalents.find(t => t._id === id));
      alert('Moved to pending!');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Permanently delete this talent?')) {
      const updatedTalents = talents.filter(t => t._id !== id);
      localStorage.setItem('talents', JSON.stringify(updatedTalents));
      setTalents(updatedTalents);
      setIsDetailModalOpen(false);
      alert('Talent deleted!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const totalTalents = talents.length;
  const approvedTalents = talents.filter(t => t.approvalStatus === 'approved').length;
  const pendingTalents = talents.filter(t => t.approvalStatus === 'pending').length;
  const rejectedTalents = talents.filter(t => t.approvalStatus === 'rejected').length;

  return (
    <div className="mt-4 w-11/12 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Talent Hunt Applications</h1>
          <button
            onClick={loadTalents}
            className="btn btn-outline gap-2"
          >
            <span>🔄</span>
            Refresh
          </button>
        </div>
        <p className="text-gray-600">Review and manage talent hunt registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total</h3>
          <p className="text-3xl font-bold text-blue-600">{totalTalents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingTalents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{approvedTalents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{rejectedTalents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Categories</h3>
          <p className="text-3xl font-bold text-purple-600">{new Set(talents.map(t => t.talentCategory)).size}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or talent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="all">All ({totalTalents})</option>
            <option value="pending">Pending ({pendingTalents})</option>
            <option value="approved">Approved ({approvedTalents})</option>
            <option value="rejected">Rejected ({rejectedTalents})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Talent</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Registered</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTalents.length > 0 ? (
                filteredTalents.map(talent => (
                  <tr key={talent._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{talent.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="badge badge-sm">{talent.talentCategory}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a href={`mailto:${talent.email}`} className="hover:text-primary">
                        {talent.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {talent.approvalStatus === 'approved' && (
                        <span className="badge badge-success gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {talent.approvalStatus === 'pending' && (
                        <span className="badge badge-warning gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {talent.approvalStatus === 'rejected' && (
                        <span className="badge badge-error gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(talent.registeredDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewDetails(talent)}
                          className="btn btn-sm btn-ghost gap-1"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {talent.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(talent._id)}
                              className="btn btn-sm btn-success gap-1 text-white"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(talent._id)}
                              className="btn btn-sm btn-error gap-1 text-white"
                              title="Reject"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {talent.approvalStatus !== 'pending' && (
                          <button
                            onClick={() => handlePending(talent._id)}
                            className="btn btn-sm btn-warning gap-1 text-white"
                            title="Pending"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(talent._id)}
                          className="btn btn-sm btn-ghost text-error gap-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No talents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {isDetailModalOpen && selectedTalent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedTalent.fullName}</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div>
                {selectedTalent.approvalStatus === 'approved' && (
                  <span className="badge badge-success badge-lg gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approved
                  </span>
                )}
                {selectedTalent.approvalStatus === 'pending' && (
                  <span className="badge badge-warning badge-lg gap-2">
                    <Clock className="w-4 h-4" />
                    Pending Review
                  </span>
                )}
                {selectedTalent.approvalStatus === 'rejected' && (
                  <div>
                    <span className="badge badge-error badge-lg gap-2 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      Rejected
                    </span>
                    {selectedTalent.rejectionReason && (
                      <p className="text-sm text-error mt-2">
                        <strong>Reason:</strong> {selectedTalent.rejectionReason}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-gray-900">📞 Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-gray-600">Email:</span> 
                    <a href={`mailto:${selectedTalent.email}`} className="text-primary hover:underline ml-2">
                      {selectedTalent.email}
                    </a>
                  </p>
                  <p><span className="font-semibold text-gray-600">Phone:</span> 
                    <a href={`tel:${selectedTalent.phone}`} className="text-primary hover:underline ml-2">
                      {selectedTalent.phone}
                    </a>
                  </p>
                </div>
              </div>

              {/* Talent Details */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-gray-900">⭐ Talent Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-semibold">Category</p>
                    <p className="text-gray-900">{selectedTalent.talentCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Experience</p>
                    <p className="text-gray-900">{selectedTalent.experience || 'Not specified'} years</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-bold mb-2 text-gray-900">📝 About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedTalent.bio || 'No bio provided'}
                </p>
              </div>

              {/* Social Links */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-gray-900">🔗 Links</h3>
                <div className="space-y-2 text-sm">
                  {selectedTalent.portfolioLink && (
                    <p>
                      <span className="font-semibold text-gray-600">Portfolio:</span>
                      <a href={selectedTalent.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                        View
                      </a>
                    </p>
                  )}
                  {selectedTalent.socialMedia && (
                    <p>
                      <span className="font-semibold text-gray-600">Social Media:</span>
                      <a href={selectedTalent.socialMedia} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                        View
                      </a>
                    </p>
                  )}
                  {!selectedTalent.portfolioLink && !selectedTalent.socialMedia && (
                    <p className="text-gray-500">No links provided</p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p><strong>📅 Registered:</strong> {new Date(selectedTalent.registeredDate).toLocaleString()}</p>
                {selectedTalent.approvalStatus === 'approved' && selectedTalent.approvedDate && (
                  <p><strong>✓ Approved:</strong> {new Date(selectedTalent.approvedDate).toLocaleString()}</p>
                )}
                {selectedTalent.approvalStatus === 'rejected' && selectedTalent.rejectionDate && (
                  <p><strong>✗ Rejected:</strong> {new Date(selectedTalent.rejectionDate).toLocaleString()}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 flex-wrap">
                {selectedTalent.approvalStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedTalent._id);
                        setIsDetailModalOpen(false);
                      }}
                      className="btn btn-success flex-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedTalent._id);
                      }}
                      className="btn btn-error flex-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {selectedTalent.approvalStatus !== 'pending' && (
                  <button
                    onClick={() => {
                      handlePending(selectedTalent._id);
                    }}
                    className="btn btn-warning flex-1"
                  >
                    <Clock className="w-4 h-4" />
                    Move to Pending
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete(selectedTalent._id);
                    setIsDetailModalOpen(false);
                  }}
                  className="btn btn-error flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="btn btn-ghost flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTalentHunt;