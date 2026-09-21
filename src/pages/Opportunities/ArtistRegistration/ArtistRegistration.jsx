// File: src/Pages/ArtistRegistration/ArtistRegistration.jsx (Updated - Saves to localStorage)
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { formsApi } from '../../../services/forms';

export default function ArtistRegistration() {
  const [formData, setFormData] = useState({
    _id: '',
    artistName: '',
    stageName: '',
    email: '',
    phone: '',
    artForm: '',
    experience: '',
    bio: '',
    instagram: '',
    facebook: '',
    youtube: '',
    availability: '',
    rateRange: '',
    agreement: false,
    registeredDate: new Date().toISOString()
  });

  const artForms = [
    'Classical Music',
    'Contemporary Music',
    'Traditional Dance',
    'Modern Dance',
    'Painting',
    'Sculpture',
    'Digital Art',
    'Theater',
    'Stand-up Comedy',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.artistName.trim()) {
      toast.error('Artist name required');
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
    if (!formData.artForm) {
      toast.error('Select art form');
      return;
    }
    if (!formData.agreement) {
      toast.error('Agree to terms first');
      return;
    }

    try {
      await formsApi.artistApplication({
        full_name: formData.artistName,
        stage_name: formData.stageName || '',
        email: formData.email,
        phone: formData.phone,
        category: formData.artForm || 'other',
        experience_years: Number(formData.experience) || 0,
        bio: formData.bio || '',
        portfolio_url: formData.youtube || formData.instagram || formData.facebook || '',
        source_path: '/opportunities/artist-registration',
      });

      toast.success('✓ Registration submitted successfully! Our team will review your profile.');
      
      // Reset form
      setFormData({
        _id: '',
        artistName: '',
        stageName: '',
        email: '',
        phone: '',
        artForm: '',
        experience: '',
        bio: '',
        instagram: '',
        facebook: '',
        youtube: '',
        availability: '',
        rateRange: '',
        agreement: false,
        registeredDate: new Date().toISOString()
      });

      // Optional: Redirect after success
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Error submitting registration. Please try again.');
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      _id: '',
      artistName: '',
      stageName: '',
      email: '',
      phone: '',
      artForm: '',
      experience: '',
      bio: '',
      instagram: '',
      facebook: '',
      youtube: '',
      availability: '',
      rateRange: '',
      agreement: false,
      registeredDate: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 pt-28">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Artist Registration</h1>
          <p className="text-gray-600">Join our platform and get booking opportunities</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Artist Name */}
          <div>
            <label className="block font-bold mb-2 text-gray-900">Full Name *</label>
            <input
              type="text"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full input input-bordered focus:input-primary"
              required
            />
          </div>

          {/* Stage Name */}
          <div>
            <label className="block font-bold mb-2 text-gray-900">Stage Name (Optional)</label>
            <input
              type="text"
              name="stageName"
              value={formData.stageName}
              onChange={handleChange}
              placeholder="Your stage name"
              className="w-full input input-bordered focus:input-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-bold mb-2 text-gray-900">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full input input-bordered focus:input-primary"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-bold mb-2 text-gray-900">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+880 1XXXXXXXXX"
              className="w-full input input-bordered focus:input-primary"
              required
            />
          </div>

          {/* Art Form */}
          <div>
            <label className="block font-bold mb-2 text-gray-900">Art Form *</label>
            <select
              name="artForm"
              value={formData.artForm}
              onChange={handleChange}
              className="w-full select select-bordered focus:select-primary"
              required
            >
              <option value="">-- Select Art Form --</option>
              {artForms.map((art, idx) => (
                <option key={idx} value={art}>{art}</option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block font-bold mb-2 text-gray-900">Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 10"
              className="w-full input input-bordered focus:input-primary"
              min="0"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-bold mb-2 text-gray-900">Professional Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your artistic journey..."
              rows="4"
              className="w-full textarea textarea-bordered focus:textarea-primary"
            />
          </div>

          {/* Social Media Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-4 text-gray-900">Social Media Profiles</h3>
            
            {/* Instagram */}
            <div className="mb-3">
              <label className="block font-semibold mb-2 text-gray-800">Instagram Profile</label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/yourprofile"
                className="w-full input input-bordered input-sm focus:input-primary"
              />
            </div>

            {/* Facebook */}
            <div className="mb-3">
              <label className="block font-semibold mb-2 text-gray-800">Facebook Profile</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/yourprofile"
                className="w-full input input-bordered input-sm focus:input-primary"
              />
            </div>

            {/* YouTube */}
            <div>
              <label className="block font-semibold mb-2 text-gray-800">YouTube Channel</label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/@yourChannel"
                className="w-full input input-bordered input-sm focus:input-primary"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block font-bold mb-2 text-gray-900">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full select select-bordered focus:select-primary"
            >
              <option value="">-- Select Availability --</option>
              <option value="Always Available">Always Available</option>
              <option value="Weekends Only">Weekends Only</option>
              <option value="Specific Dates">Specific Dates</option>
              <option value="By Request">By Request</option>
            </select>
          </div>

          {/* Rate Range */}
          <div>
            <label className="block font-bold mb-2 text-gray-900">Rate Range (Per Event)</label>
            <select
              name="rateRange"
              value={formData.rateRange}
              onChange={handleChange}
              className="w-full select select-bordered focus:select-primary"
            >
              <option value="">-- Select Rate Range --</option>
              <option value="৳5,000 - ৳10,000">$5,000 - $10,000</option>
              <option value="৳10,000 - ৳25,000">$10,000 - $25,000</option>
              <option value="৳25,000 - ৳50,000">$25,000 - $50,000</option>
              <option value="৳50,000+">$50,000+</option>
            </select>
          </div>

          {/* Agreement Checkbox */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                className="checkbox checkbox-primary mt-1"
                required
              />
              <label className="cursor-pointer text-gray-700 text-sm">
                <span className="font-semibold">I agree to Anata Events terms and conditions.</span> My profile will be visible to event organizers and I will receive booking inquiries.
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 btn btn-primary btn-lg"
            >
              Register as Artist
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 btn btn-outline btn-lg"
            >
              Clear Form
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-bold text-green-900 mb-2">✓ What happens after registration?</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Your profile will be reviewed by our team</li>
            <li>• You'll receive booking inquiries from event organizers</li>
            <li>• Update your profile anytime from your dashboard</li>
            <li>• Start earning by accepting bookings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}