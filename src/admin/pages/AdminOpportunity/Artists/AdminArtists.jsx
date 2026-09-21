// File: src/Admin/Pages/Artists/AdminArtists.jsx (Updated - With Approval/Pending Status)
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Eye, X, Mail, Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AdminArtists = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, verified, pending, rejected

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = () => {
    try {
      setLoading(true);
      let data = [];
      const savedArtists = localStorage.getItem('artists');
      
      if (savedArtists) {
        data = JSON.parse(savedArtists);
      }

      setArtists(data);
      setFilteredArtists(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading artists:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = artists;

    // Filter by status
    if (filterStatus === 'approved') {
      filtered = filtered.filter(artist => artist.approvalStatus === 'approved');
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(artist => artist.approvalStatus === 'pending');
    } else if (filterStatus === 'rejected') {
      filtered = filtered.filter(artist => artist.approvalStatus === 'rejected');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(artist =>
        artist.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.artForm.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArtists(filtered);
  }, [searchTerm, artists, filterStatus]);

  const handleViewDetails = (artist) => {
    setSelectedArtist(artist);
    setIsDetailModalOpen(true);
  };

  // ✅ Approve artist
  const handleApprove = (id) => {
    if (window.confirm('Approve this artist registration?')) {
      const updatedArtists = artists.map(a =>
        a._id === id ? { 
          ...a, 
          approvalStatus: 'approved',
          approvedDate: new Date().toISOString()
        } : a
      );
      localStorage.setItem('artists', JSON.stringify(updatedArtists));
      setArtists(updatedArtists);
      setSelectedArtist(updatedArtists.find(a => a._id === id));
      alert('✓ Artist approved successfully!');
    }
  };

  // ✅ Reject artist
  const handleReject = (id) => {
    const reason = prompt('Enter reason for rejection (optional):');
    if (reason !== null) {
      const updatedArtists = artists.map(a =>
        a._id === id ? { 
          ...a, 
          approvalStatus: 'rejected',
          rejectionReason: reason,
          rejectionDate: new Date().toISOString()
        } : a
      );
      localStorage.setItem('artists', JSON.stringify(updatedArtists));
      setArtists(updatedArtists);
      setSelectedArtist(updatedArtists.find(a => a._id === id));
      alert('✗ Artist rejected!');
    }
  };

  // ✅ Move back to pending
  const handlePending = (id) => {
    if (window.confirm('Move this artist back to pending?')) {
      const updatedArtists = artists.map(a =>
        a._id === id ? { 
          ...a, 
          approvalStatus: 'pending',
          rejectionReason: '',
          rejectionDate: null
        } : a
      );
      localStorage.setItem('artists', JSON.stringify(updatedArtists));
      setArtists(updatedArtists);
      setSelectedArtist(updatedArtists.find(a => a._id === id));
      alert('Artist moved to pending!');
    }
  };

  // ✅ Delete artist
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this artist registration?')) {
      const updatedArtists = artists.filter(a => a._id !== id);
      localStorage.setItem('artists', JSON.stringify(updatedArtists));
      setArtists(updatedArtists);
      setIsDetailModalOpen(false);
      alert('Artist deleted!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const totalArtists = artists.length;
  const approvedArtists = artists.filter(a => a.approvalStatus === 'approved').length;
  const pendingArtists = artists.filter(a => a.approvalStatus === 'pending').length;
  const rejectedArtists = artists.filter(a => a.approvalStatus === 'rejected').length;

  return (
    <div className="mt-4 w-11/12 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Artist Registrations</h1>
          <button
            onClick={loadArtists}
            className="btn btn-outline gap-2"
          >
            <span>🔄</span>
            Refresh
          </button>
        </div>
        <p className="text-gray-600">Review and approve artist registrations from the website</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total</h3>
          <p className="text-3xl font-bold text-blue-600">{totalArtists}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingArtists}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{approvedArtists}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{rejectedArtists}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Art Forms</h3>
          <p className="text-3xl font-bold text-purple-600">{new Set(artists.map(a => a.artForm)).size}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or art form..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="all">All Artists ({totalArtists})</option>
            <option value="pending">Pending ({pendingArtists})</option>
            <option value="approved">Approved ({approvedArtists})</option>
            <option value="rejected">Rejected ({rejectedArtists})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Artist Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Art Form</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Registered</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArtists.length > 0 ? (
                filteredArtists.map(artist => (
                  <tr key={artist._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      <div>
                        <p className="font-semibold">{artist.artistName}</p>
                        {artist.stageName && <p className="text-xs text-gray-500">"{artist.stageName}"</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="badge badge-sm">{artist.artForm}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a href={`mailto:${artist.email}`} className="hover:text-primary">
                        {artist.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {artist.approvalStatus === 'approved' && (
                        <span className="badge badge-success gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {artist.approvalStatus === 'pending' && (
                        <span className="badge badge-warning gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {artist.approvalStatus === 'rejected' && (
                        <span className="badge badge-error gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(artist.registeredDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewDetails(artist)}
                          className="btn btn-sm btn-ghost gap-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {artist.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(artist._id)}
                              className="btn btn-sm btn-success gap-1 text-white"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(artist._id)}
                              className="btn btn-sm btn-error gap-1 text-white"
                              title="Reject"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {artist.approvalStatus !== 'pending' && (
                          <button
                            onClick={() => handlePending(artist._id)}
                            className="btn btn-sm btn-warning gap-1 text-white"
                            title="Move to Pending"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(artist._id)}
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
                    No artists found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {isDetailModalOpen && selectedArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedArtist.artistName}</h2>
                {selectedArtist.stageName && (
                  <p className="text-sm text-gray-500">Stage Name: "{selectedArtist.stageName}"</p>
                )}
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div>
                {selectedArtist.approvalStatus === 'approved' && (
                  <span className="badge badge-success badge-lg gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approved Artist
                  </span>
                )}
                {selectedArtist.approvalStatus === 'pending' && (
                  <span className="badge badge-warning badge-lg gap-2">
                    <Clock className="w-4 h-4" />
                    Pending Review
                  </span>
                )}
                {selectedArtist.approvalStatus === 'rejected' && (
                  <div>
                    <span className="badge badge-error badge-lg gap-2 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      Rejected
                    </span>
                    {selectedArtist.rejectionReason && (
                      <p className="text-sm text-error mt-2">
                        <strong>Reason:</strong> {selectedArtist.rejectionReason}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-gray-900">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-gray-600">Email:</span> 
                    <a href={`mailto:${selectedArtist.email}`} className="text-primary hover:underline ml-2">
                      {selectedArtist.email}
                    </a>
                  </p>
                  <p><span className="font-semibold text-gray-600">Phone:</span> 
                    <a href={`tel:${selectedArtist.phone}`} className="text-primary hover:underline ml-2">
                      {selectedArtist.phone}
                    </a>
                  </p>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-gray-900">Professional Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-semibold">Art Form</p>
                    <p className="text-gray-900">{selectedArtist.artForm}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Experience</p>
                    <p className="text-gray-900">{selectedArtist.experience || 'Not specified'} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Availability</p>
                    <p className="text-gray-900">{selectedArtist.availability || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Rate Range</p>
                    <p className="text-gray-900">{selectedArtist.rateRange || 'Not set'}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-bold mb-2 text-gray-900">Professional Bio</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedArtist.bio || 'No bio provided'}
                </p>
              </div>

              {/* Social Media */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-gray-900">Social Media</h3>
                <div className="space-y-2 text-sm">
                  {selectedArtist.instagram && (
                    <p>
                      <span className="font-semibold text-gray-600">Instagram:</span>
                      <a href={selectedArtist.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                        View Profile
                      </a>
                    </p>
                  )}
                  {selectedArtist.facebook && (
                    <p>
                      <span className="font-semibold text-gray-600">Facebook:</span>
                      <a href={selectedArtist.facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                        View Profile
                      </a>
                    </p>
                  )}
                  {selectedArtist.youtube && (
                    <p>
                      <span className="font-semibold text-gray-600">YouTube:</span>
                      <a href={selectedArtist.youtube} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                        View Channel
                      </a>
                    </p>
                  )}
                  {!selectedArtist.instagram && !selectedArtist.facebook && !selectedArtist.youtube && (
                    <p className="text-gray-500">No social media profiles provided</p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p><strong>Registered:</strong> {new Date(selectedArtist.registeredDate).toLocaleString()}</p>
                {selectedArtist.approvalStatus === 'approved' && selectedArtist.approvedDate && (
                  <p><strong>Approved:</strong> {new Date(selectedArtist.approvedDate).toLocaleString()}</p>
                )}
                {selectedArtist.approvalStatus === 'rejected' && selectedArtist.rejectionDate && (
                  <p><strong>Rejected:</strong> {new Date(selectedArtist.rejectionDate).toLocaleString()}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 flex-wrap">
                {selectedArtist.approvalStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedArtist._id);
                        setIsDetailModalOpen(false);
                      }}
                      className="btn btn-success flex-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedArtist._id);
                      }}
                      className="btn btn-error flex-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {selectedArtist.approvalStatus !== 'pending' && (
                  <button
                    onClick={() => {
                      handlePending(selectedArtist._id);
                    }}
                    className="btn btn-warning flex-1"
                  >
                    <Clock className="w-4 h-4" />
                    Move to Pending
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete(selectedArtist._id);
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

export default AdminArtists;