import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function ArtistRegistration() {
  const [formData, setFormData] = useState({
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
    agreement: false
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.artistName) {
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

    toast.success('✓ Registration submitted successfully!');
    
    // Reset form
    setFormData({
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
      agreement: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Artist Registration</h1>
          <p className="text-gray-600">Join our platform and get booking opportunities</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Artist Name */}
          <div>
            <label className="block font-bold mb-2">Full Name *</label>
            <input
              type="text"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Stage Name */}
          <div>
            <label className="block font-bold mb-2">Stage Name (Optional)</label>
            <input
              type="text"
              name="stageName"
              value={formData.stageName}
              onChange={handleChange}
              placeholder="Your stage name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-bold mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-bold mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+880 1XXXXXXXXX"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Art Form */}
          <div>
            <label className="block font-bold mb-2">Art Form *</label>
            <select
              name="artForm"
              value={formData.artForm}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">-- Select Art Form --</option>
              {artForms.map((art, idx) => (
                <option key={idx} value={art}>{art}</option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block font-bold mb-2">Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 10"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-bold mb-2">Professional Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your artistic journey..."
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block font-bold mb-2">Instagram Profile</label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/yourprofile"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block font-bold mb-2">Facebook Profile</label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/yourprofile"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* YouTube */}
          <div>
            <label className="block font-bold mb-2">YouTube Channel</label>
            <input
              type="url"
              name="youtube"
              value={formData.youtube}
              onChange={handleChange}
              placeholder="https://youtube.com/@yourChannel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block font-bold mb-2">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
            <label className="block font-bold mb-2">Rate Range (Per Event)</label>
            <select
              name="rateRange"
              value={formData.rateRange}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">-- Select Rate Range --</option>
              <option value="৳5,000 - ৳10,000">৳5,000 - ৳10,000</option>
              <option value="৳10,000 - ৳25,000">৳10,000 - ৳25,000</option>
              <option value="৳25,000 - ৳50,000">৳25,000 - ৳50,000</option>
              <option value="৳50,000+">৳50,000+</option>
            </select>
          </div>

          {/* Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={handleChange}
              className="w-4 h-4 mr-3 cursor-pointer"
            />
            <label className="cursor-pointer text-gray-700">
              I agree to AnataEvents terms and my profile will be visible to event organizers
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-bold hover:bg-pink-700"
            >
              Register as Artist
            </button>
            <button
              type="reset"
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}