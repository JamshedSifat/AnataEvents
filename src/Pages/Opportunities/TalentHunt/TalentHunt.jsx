import React, { useState } from 'react';
import { toast } from 'react-toastify';
import TalentHuntFeature from './TalentHuntFeature';

export default function TalentHunt() {
  const [showModal, setShowModal] = useState(false);
  const [showFeature, setShowFeature] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    talentCategory: '',
    experience: '',
    bio: '',
    socialMedia: '',
    videoFile: null,
    videoFileName: '',
    portfolioLink: '',
    agreement: false
  });

  const talentCategories = [
    'Singing',
    'Dancing',
    'Acting',
    'Comedy',
    'Magic',
    'Performing Arts',
    'Music Production',
    'Hosting',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        videoFile: file,
        videoFileName: file.name
      }));
      toast.success(' Video uploaded: ' + file.name);
    }
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
    if (!formData.talentCategory) {
      toast.error('Select talent category');
      return;
    }
    if (!formData.bio) {
      toast.error('Bio is required');
      return;
    }
    if (!formData.agreement) {
      toast.error('Agree to terms first');
      return;
    }

    toast.success('✓ Application submitted! We will review and contact you soon.');
    
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      talentCategory: '',
      experience: '',
      bio: '',
      socialMedia: '',
      videoFile: null,
      videoFileName: '',
      portfolioLink: '',
      agreement: false
    });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <div className="py-22 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-3"> Talent <span className='text-primary'>Hunt</span></h1>
          <p className="text-xl">
            Discover amazing talents across Bangladesh. Join our community of performers!
          </p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* View Talents Button */}
          <button
            onClick={() => setShowFeature(!showFeature)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-2 border-purple-200"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-2xl font-bold text-primary mb-2">View Featured Talents</h3>
            <p className="text-gray-600 mb-4">Explore our talented performers and success stories</p>
            <button className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-600 w-full">
              {showFeature ? '✓ View Talents' : 'View Talents'}
            </button>
          </button>

          {/* Register Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-2 border-pink-200"
          >
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-2xl font-bold text-pink-600 mb-2">Register Your Talent</h3>
            <p className="text-gray-600 mb-4">Showcase your talent and get discovered today</p>
            <button className="bg-pink-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700 w-full">
              Register Now
            </button>
          </button>
        </div>
      </div>

      {/* Features Section - Conditionally Rendered */}
      {showFeature && (
        <div className="bg-white">
          <TalentHuntFeature />
        </div>
      )}

     

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-pink-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold"> Register Your Talent</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl font-bold hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block font-bold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Talent Category & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2">Talent Category *</label>
                    <select
                      name="talentCategory"
                      value={formData.talentCategory}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">-- Select --</option>
                      {talentCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Experience (Years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g., 3"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block font-bold mb-2">About Your Talent *</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Portfolio Link */}
                <div>
                  <label className="block font-bold mb-2">Portfolio Link</label>
                  <input
                    type="url"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                    placeholder="https://myportfolio.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Social Media */}
                <div>
                  <label className="block font-bold mb-2">Social Media Profile</label>
                  <input
                    type="url"
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourprofile"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Video Upload */}
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-purple-50 cursor-pointer">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/mp4,video/avi,video/quicktime,video/webm"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <div>
                      <p className="text-2xl mb-2">🎥</p>
                      <p className="font-bold text-purple-600">Upload Video</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {formData.videoFileName || 'Click to upload'}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleChange}
                    className="w-4 h-4 mr-3 mt-1 cursor-pointer"
                  />
                  <label className="cursor-pointer text-sm text-gray-700">
                    I agree that AnataEvents can use my profile and videos for talent hunting
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition-all"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}