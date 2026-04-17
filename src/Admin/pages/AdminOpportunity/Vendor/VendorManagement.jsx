// File: src/Admin/Pages/Vendors/VendorManagement.jsx (Full Code - Fixed)
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Eye, X, Download } from 'lucide-react';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);

  const serviceCategories = [
    'All',
    'Catering',
    'Decoration',
    'Photography',
    'Videography',
    'Sound & Lighting',
    'Transportation',
    'Venue',
    'Entertainment',
    'Florist',
    'Other'
  ];

  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = () => {
    try {
      setLoading(true);
      const savedVendors = localStorage.getItem('vendors');
      if (savedVendors) {
        const data = JSON.parse(savedVendors);
        setVendors(data);
        setFilteredVendors(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading vendors:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = vendors;

    if (filterCategory !== 'All') {
      filtered = filtered.filter(vendor => vendor.serviceCategory === filterCategory);
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(vendor => vendor.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
  }, [searchTerm, filterCategory, filterStatus, vendors]);

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (id) => {
    const updatedVendors = vendors.map(vendor =>
      vendor.id === id ? { ...vendor, status: 'Approved' } : vendor
    );
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
    setVendors(updatedVendors);
    alert('Vendor approved successfully!');
    setIsDetailModalOpen(false);
  };

  const handleReject = (id) => {
    const updatedVendors = vendors.map(vendor =>
      vendor.id === id ? { ...vendor, status: 'Rejected' } : vendor
    );
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
    setVendors(updatedVendors);
    alert('Vendor rejected!');
    setIsDetailModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      const updatedVendors = vendors.filter(vendor => vendor.id !== id);
      localStorage.setItem('vendors', JSON.stringify(updatedVendors));
      setVendors(updatedVendors);
      alert('Vendor deleted successfully!');
    }
  };

  // ✅ Get file type
  const getFileType = (fileName) => {
    if (!fileName) return 'file';
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'document';
    return 'file';
  };

  // ✅ Get file icon
  const getFileIcon = (fileName) => {
    if (!fileName) return '📎';
    const type = getFileType(fileName);
    if (type === 'image') return '🖼️';
    if (type === 'pdf') return '📕';
    if (type === 'document') return '📄';
    return '📎';
  };

  // ✅ View Document with Base64
  const viewDocument = (vendor) => {
    setDocumentPreview({
      fileName: vendor.documentFileName,
      vendorName: vendor.businessName,
      base64: vendor.documentBase64, // ✅ BASE64 DATA
      type: getFileType(vendor.documentFileName)
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge-success';
      case 'Rejected':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  // ✅ Download document
  const downloadDocument = (base64, fileName) => {
    if (!base64) {
      alert('No document data available');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = base64;
      link.download = fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
        <p className="text-gray-600">Review and manage vendor registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Vendors</h3>
          <p className="text-3xl font-bold text-primary">{vendors.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{vendors.filter(v => v.status === 'Approved').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{vendors.filter(v => v.status === 'Pending').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{vendors.filter(v => v.status === 'Rejected').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="select select-bordered flex-1"
        >
          {serviceCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="select select-bordered flex-1"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Business Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Owner</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.length > 0 ? (
                filteredVendors.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      <div className="line-clamp-1">{vendor.businessName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vendor.ownerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="badge badge-sm">{vendor.serviceCategory}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a href={`mailto:${vendor.email}`} className="text-primary hover:underline truncate">
                        {vendor.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a href={`tel:${vendor.phone}`} className="text-primary hover:underline">
                        {vendor.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`badge ${getStatusColor(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {vendor.registrationDate}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(vendor)}
                          className="btn btn-sm btn-ghost gap-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor.id)}
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
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedVendor.businessName}
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`badge badge-lg ${getStatusColor(selectedVendor.status)}`}>
                  {selectedVendor.status}
                </span>
                <span className="text-gray-500 text-sm">ID: {selectedVendor.id}</span>
              </div>

              {/* Business Information */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Business Name</label>
                    <p className="font-semibold text-gray-900">{selectedVendor.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Owner Name</label>
                    <p className="font-semibold text-gray-900">{selectedVendor.ownerName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Service Category</label>
                    <p className="font-semibold text-gray-900">{selectedVendor.serviceCategory}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Experience (Years)</label>
                    <p className="font-semibold text-gray-900">{selectedVendor.experience || 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-600">Business Address</label>
                  <p className="font-semibold text-gray-900">{selectedVendor.businessAddress || 'N/A'}</p>
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-600">Description</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedVendor.description}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <a href={`mailto:${selectedVendor.email}`} className="font-semibold text-primary hover:underline">
                      {selectedVendor.email}
                    </a>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <a href={`tel:${selectedVendor.phone}`} className="font-semibold text-primary hover:underline">
                      {selectedVendor.phone}
                    </a>
                  </div>
                </div>

                {selectedVendor.website && (
                  <div className="mt-4">
                    <label className="text-sm text-gray-600">Website</label>
                    <a href={selectedVendor.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                      {selectedVendor.website}
                    </a>
                  </div>
                )}
              </div>

              {/* ✅ Gallery Images */}
              {selectedVendor.galleryImages && selectedVendor.galleryImages.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">
                    Gallery Images ({selectedVendor.galleryImages.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedVendor.galleryImages.map((image, idx) => (
                      <div 
                        key={idx} 
                        className="relative group cursor-pointer rounded-lg overflow-hidden h-40 bg-gray-200"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img 
                          src={image} 
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-white font-bold">View</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ Document Section */}
              {selectedVendor.documentFileName && (
                <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <span>����</span> Documents
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-blue-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <span className="text-2xl">
                            {getFileIcon(selectedVendor.documentFileName)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">License/Certificate</p>
                          <p className="font-semibold text-gray-900 truncate">{selectedVendor.documentFileName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {getFileType(selectedVendor.documentFileName).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => viewDocument(selectedVendor)}
                        className="btn btn-sm btn-primary gap-2 flex-shrink-0"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    ℹ️ Document uploaded: {selectedVendor.registrationDate}
                  </p>
                </div>
              )}

              {/* ✅ No Document Message */}
              {!selectedVendor.documentFileName && (
                <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                  <p className="text-yellow-800 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>No document uploaded</span>
                  </p>
                </div>
              )}

              {/* Bank Information */}
              {(selectedVendor.bankName || selectedVendor.accountNumber) && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Bank Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Bank Name</label>
                      <p className="font-semibold text-gray-900">{selectedVendor.bankName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Account Number</label>
                      <p className="font-semibold text-gray-900">••••••••••{selectedVendor.accountNumber?.slice(-4) || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Date */}
              <div className="border rounded-lg p-4">
                <label className="text-sm text-gray-600">Registration Date</label>
                <p className="font-semibold text-gray-900">{selectedVendor.registrationDate}</p>
              </div>
            </div>

            {/* Modal Footer */}
            {selectedVendor.status === 'Pending' && (
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => handleReject(selectedVendor.id)}
                  className="btn btn-error text-white"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedVendor.id)}
                  className="btn btn-success text-white"
                >
                  Approve
                </button>
              </div>
            )}

            {selectedVendor.status !== 'Pending' && (
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="btn btn-primary"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-2xl w-full">
            <img 
              src={selectedImage} 
              alt="Gallery Image"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ Document Preview Modal - Fixed */}
      {documentPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>{getFileIcon(documentPreview.fileName)}</span>
                Document Preview
              </h3>
              <button
                onClick={() => setDocumentPreview(null)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {documentPreview.type === 'image' && documentPreview.base64 ? (
                // ✅ Image Preview
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={documentPreview.base64} 
                    alt={documentPreview.fileName}
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                // ✅ PDF/Document Preview
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-12 flex flex-col items-center justify-center min-h-96">
                  <div className="text-6xl mb-4">{getFileIcon(documentPreview.fileName)}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 text-center break-words max-w-full">
                    {documentPreview.fileName}
                  </h4>
                  <p className="text-gray-600 mb-2 text-center">
                    Vendor: <span className="font-semibold">{documentPreview.vendorName}</span>
                  </p>
                  <p className="text-gray-600 mb-6 text-center">
                    File Type: <span className="font-semibold uppercase">{documentPreview.type}</span>
                  </p>
                  
                  <div className="bg-white p-6 rounded-lg border-2 border-dashed border-orange-300 w-full">
                    <p className="text-center text-gray-600 mb-4">
                      📄 Document file uploaded for verification
                    </p>
                    <div className="text-sm text-gray-500 text-center space-y-2">
                      <p>✓ File stored securely</p>
                      <p>✓ Ready for admin review</p>
                    </div>
                  </div>
                </div>
              )}

              {/* File Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">File Name:</span> {documentPreview.fileName}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Type:</span> {documentPreview.type.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setDocumentPreview(null)}
                className="btn btn-ghost"
              >
                Close
              </button>
              
              {/* ✅ Fixed Download Button */}
              {documentPreview.base64 && (
                <button
                  onClick={() => downloadDocument(documentPreview.base64, documentPreview.fileName)}
                  className="btn btn-primary gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;