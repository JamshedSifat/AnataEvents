// File: src/Pages/VendorRegistration/VendorRegistration.jsx (Fixed)
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
    documentBase64: '', // ✅ ADD THIS
    galleryImages: [],
    galleryImageBase64: [],
    galleryImageNames: [],
    bankName: '',
    accountNumber: '',
    agreement: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // ✅ Convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // ✅ Handle Document Upload with Base64 Conversion
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        toast.info('Converting document...');
        const base64 = await fileToBase64(file);
        setFormData(prev => ({
          ...prev,
          documents: file,
          documentFileName: file.name,
          documentBase64: base64 // ✅ SAVE BASE64
        }));
        toast.success('✓ Document uploaded: ' + file.name);
      } catch (error) {
        toast.error('Error uploading document');
        console.error(error);
      }
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = formData.galleryImages.concat(files);
      
      if (newFiles.length > 10) {
        toast.error('Maximum 10 images allowed');
        return;
      }

      try {
        toast.info('Converting images...');
        
        const base64Array = [];
        for (const file of files) {
          const base64 = await fileToBase64(file);
          base64Array.push(base64);
        }

        setFormData(prev => ({
          ...prev,
          galleryImages: newFiles,
          galleryImageBase64: [...prev.galleryImageBase64, ...base64Array],
          galleryImageNames: newFiles.map(f => f.name)
        }));

        toast.success('✓ ' + files.length + ' image(s) converted and added');
      } catch (error) {
        toast.error('Error converting images');
        console.error(error);
      }
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
      galleryImageBase64: prev.galleryImageBase64.filter((_, i) => i !== index),
      galleryImageNames: prev.galleryImageNames.filter((_, i) => i !== index)
    }));
    toast.info('Image removed');
  };

  const handleSubmit = async (e) => {
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

    try {
      setIsSubmitting(true);

      const newVendor = {
        id: Date.now(),
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        serviceCategory: formData.serviceCategory,
        experience: formData.experience,
        businessAddress: formData.businessAddress,
        description: formData.description,
        website: formData.website,
        documentFileName: formData.documentFileName,
        documentBase64: formData.documentBase64, // ✅ SAVE DOCUMENT BASE64
        galleryImages: formData.galleryImageBase64,
        galleryImageNames: formData.galleryImageNames,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        status: 'Pending',
        registrationDate: new Date().toLocaleDateString()
      };

      const existingVendors = localStorage.getItem('vendors');
      const vendors = existingVendors ? JSON.parse(existingVendors) : [];
      vendors.push(newVendor);
      localStorage.setItem('vendors', JSON.stringify(vendors));

      toast.success('✓ Registration submitted successfully!');
      
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
        documentBase64: '',
        galleryImages: [],
        galleryImageBase64: [],
        galleryImageNames: [],
        bankName: '',
        accountNumber: '',
        agreement: false
      });

      setIsSubmitting(false);
    } catch (error) {
      toast.error('Error submitting registration');
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
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
      documentBase64: '',
      galleryImages: [],
      galleryImageBase64: [],
      galleryImageNames: [],
      bankName: '',
      accountNumber: '',
      agreement: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 pt-28">
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
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
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
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2">Service Category *</label>
                  <select
                    name="serviceCategory"
                    value={formData.serviceCategory}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    disabled={isSubmitting}
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
                  className="textarea textarea-bordered w-full"
                  disabled={isSubmitting}
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
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
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
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
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
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
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
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
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
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Documents */}
            <div className="border-b pb-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">📄 Documents</h3>
              
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 cursor-pointer hover:bg-blue-100 transition">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    disabled={isSubmitting}
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
              
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 cursor-pointer hover:bg-blue-100 transition">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleGalleryUpload}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <div>
                    <p className="text-2xl mb-2">📸</p>
                    <p className="font-bold text-blue-600">Upload Gallery Images</p>
                    <p className="text-gray-600 text-sm mt-2">Click to add images (Max 10)</p>
                  </div>
                </label>
              </div>

              {/* Gallery Preview */}
              {formData.galleryImageBase64.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold mb-2">Uploaded Images ({formData.galleryImageBase64.length}) - Preview:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.galleryImageBase64.map((base64, idx) => (
                      <div key={idx} className="relative bg-gray-200 rounded-lg overflow-hidden h-32">
                        <img 
                          src={base64} 
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition flex items-center justify-center opacity-0 hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold"
                          >
                            ✕ Remove
                          </button>
                        </div>

                        <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate">
                          {formData.galleryImageNames[idx]}
                        </p>
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
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
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
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
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
                  className="checkbox checkbox-primary mr-3 mt-1"
                  disabled={isSubmitting}
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
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Submitting...
                  </>
                ) : (
                  '✓ Submit Registration'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold text-lg hover:bg-gray-400 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-red-50 border-l-4 border-primary p-6 rounded-lg">
          <h4 className="font-bold text-primary text-xl mb-3">✓ What We're Looking For:</h4>
          <ul className="space-y-2 text-gray-700">
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