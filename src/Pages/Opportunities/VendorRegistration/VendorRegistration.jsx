import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function VendorRegistration() {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    serviceCategory: '',
    experience: '',
    businessAddress: '',
    description: '',
    website: '',
    documents: null,
    documentFileName: '',
    galleryImages: [],
    galleryImageNames: [],
    bankName: '',
    accountNumber: '',
    agreement: false
  });

  const serviceCategories = [
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: file,
        documentFileName: file.name
      }));
      toast.success('✓ Document uploaded: ' + file.name);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = formData.galleryImages.concat(files);
      if (newFiles.length > 10) {
        toast.error('Maximum 10 images allowed');
        return;
      }
      setFormData(prev => ({
        ...prev,
        galleryImages: newFiles,
        galleryImageNames: newFiles.map(f => f.name)
      }));
      toast.success('✓ ' + files.length + ' image(s) added');
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
      galleryImageNames: prev.galleryImageNames.filter((_, i) => i !== index)
    }));
    toast.info('Image removed');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.businessName) {
      toast.error('Business name required');
      return;
    }
    if (!formData.ownerName) {
      toast.error('Owner name required');
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
    if (!formData.serviceCategory) {
      toast.error('Select service category');
      return;
    }
    if (!formData.description) {
      toast.error('Business description required');
      return;
    }
    if (!formData.agreement) {
      toast.error('Agree to terms first');
      return;
    }

    toast.success('✓ Registration submitted successfully! We will verify and contact you soon.');
    
    // Reset form
    setFormData({
      businessName: '',
      ownerName: '',
      email: '',
      phone: '',
      serviceCategory: '',
      experience: '',
      businessAddress: '',
      description: '',
      website: '',
      documents: null,
      documentFileName: '',
      galleryImages: [],
      galleryImageNames: [],
      bankName: '',
      accountNumber: '',
      agreement: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">🏢 Vendor <span className='text-primary'>Registration</span></h1>
          <p className="text-gray-600 text-lg">
            Register your business and collaborate with AnataEvents
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Business Information */}
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">📋 Business Information</h3>
              
              <div>
                <label className="block font-bold mb-2">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-bold mb-2">Owner Name *</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Owner's full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2">Service Category *</label>
                  <select
                    name="serviceCategory"
                    value={formData.serviceCategory}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Category --</option>
                    {serviceCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-bold mb-2">Business Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your business, services, experience, and what makes you special..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">📞 Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-bold mb-2">Business Address</label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  placeholder="Enter full business address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-bold mb-2">Website (Optional)</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourbusiness.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Documents */}
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">📄 Documents</h3>
              
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 cursor-pointer">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <div>
                    <p className="text-2xl mb-2">📎</p>
                    <p className="font-bold text-blue-600">Upload Business License/Certificate</p>
                    <p className="text-gray-600 text-sm mt-2">
                      {formData.documentFileName || 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">PDF, JPG, PNG, DOC, DOCX allowed</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 4: Gallery */}
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">🖼️ Business Gallery</h3>
              <p className="text-gray-600 text-sm mb-4">Upload up to 10 images of your work/services</p>
              
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 cursor-pointer">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <div>
                    <p className="text-2xl mb-2">📸</p>
                    <p className="font-bold text-blue-600">Upload Gallery Images</p>
                    <p className="text-gray-600 text-sm mt-2">Click to add images (Max 10)</p>
                  </div>
                </label>
              </div>

              {/* Gallery Preview */}
              {formData.galleryImages.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold mb-2">Uploaded Images ({formData.galleryImages.length}):</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.galleryImageNames.map((name, idx) => (
                      <div key={idx} className="relative bg-gray-200 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-700 truncate">{name}</p>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="mt-2 bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Bank Information */}
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">🏦 Bank Information (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g., Dhaka Bank"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Account number (hidden in list)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 6: Agreement */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleChange}
                  className="w-4 h-4 mr-3 mt-1 cursor-pointer"
                />
                <span className="text-gray-700">
                  I agree to AnataEvents terms and conditions. I confirm that all information provided is accurate and my business is legally registered.
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all"
              >
                ✓ Submit Registration
              </button>
              <button
                type="reset"
                onClick={() => setFormData({
                  businessName: '',
                  ownerName: '',
                  email: '',
                  phone: '',
                  serviceCategory: '',
                  experience: '',
                  businessAddress: '',
                  description: '',
                  website: '',
                  documents: null,
                  documentFileName: '',
                  galleryImages: [],
                  galleryImageNames: [],
                  bankName: '',
                  accountNumber: '',
                  agreement: false
                })}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold text-lg hover:bg-gray-400 transition-all"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-red-50 border-l-7 border-primary p-6 rounded-lg">
          <h4 className="font-bold text-primary text-xl mb-3">✓ What We're Looking For:</h4>
          <ul className="space-y-2 text-gray-700 text-xl">
            <li>✓ Professional business license/certificate</li>
            <li>✓ Quality portfolio images of your work</li>
            <li>✓ Active social media presence (bonus)</li>
            <li>✓ Professional and detailed business description</li>
            <li>✓ Our team will verify and contact you within 5 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}