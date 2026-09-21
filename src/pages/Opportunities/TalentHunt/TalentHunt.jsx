// File: src/Pages/TalentHunt/TalentHunt.jsx (Updated - Video Upload Removed)
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import TalentHuntFeature from './TalentHuntFeature';

export default function TalentHunt() {
  const [showModal, setShowModal] = useState(false);
  const [showFeature, setShowFeature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    talentCategory: '',
    experience: '',
    bio: '',
    socialMedia: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
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
    if (!formData.bio.trim()) {
      toast.error('Bio is required');
      return;
    }
    if (!formData.agreement) {
      toast.error('Agree to terms first');
      return;
    }

    saveTalent();
  };

  const saveTalent = () => {
    try {
      setIsSubmitting(true);

      // Create new talent object
      const newTalent = {
        _id: `talent-${Date.now()}`,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        talentCategory: formData.talentCategory,
        experience: formData.experience || '0',
        bio: formData.bio.trim(),
        socialMedia: formData.socialMedia || '',
        portfolioLink: formData.portfolioLink || '',
        agreement: formData.agreement,
        approvalStatus: 'pending',
        registeredDate: new Date().toISOString()
      };

      // Get existing talents
      let existingTalents = [];
      const savedTalents = localStorage.getItem('talents');
      if (savedTalents) {
        try {
          existingTalents = JSON.parse(savedTalents);
          if (!Array.isArray(existingTalents)) {
            existingTalents = [];
          }
        } catch (e) {
          existingTalents = [];
        }
      }

      // Check if email already exists
      if (existingTalents.some(t => t.email === formData.email.trim())) {
        toast.error('❌ Email already registered!');
        setIsSubmitting(false);
        return;
      }

      // Add new talent
      existingTalents.push(newTalent);

      // Save to localStorage
      localStorage.setItem('talents', JSON.stringify(existingTalents));

      toast.success('✓ Application submitted successfully! Our team will review your profile soon.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        talentCategory: '',
        experience: '',
        bio: '',
        socialMedia: '',
        portfolioLink: '',
        agreement: false
      });
      
      setShowModal(false);
      setIsSubmitting(false);

    } catch (error) {
      console.error('Error submitting talent:', error);
      toast.error('❌ Error submitting application. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      talentCategory: '',
      experience: '',
      bio: '',
      socialMedia: '',
      portfolioLink: '',
      agreement: false
    });
    toast.info('Form cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      
      {/* Header */}
      <div className="py-20 px-4 pt-28">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gray-900">
            Talent <span className='text-primary'>Hunt</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover amazing talents across Bangladesh. Join our community of performers and get discovered by event organizers today!
          </p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* View Talents Button */}
          <button
            onClick={() => setShowFeature(!showFeature)}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all border-2 border-purple-200 group"
          >
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-pink-600 transition">
              View Featured Talents
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Explore our talented performers and amazing success stories from our platform
            </p>
            <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-600 transition w-full">
              {showFeature ? '✓ Viewing Talents' : 'View Talents'}
            </button>
          </button>

          {/* Register Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all border-2 border-pink-200 group"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-pink-600 mb-2 group-hover:text-primary transition">
              Register Your Talent
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Showcase your talent and get discovered by event organizers in Bangladesh
            </p>
            <button className="bg-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-700 transition w-full">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto my-8">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-pink-600 text-white p-6 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <h2 className="text-2xl font-bold">Register Your Talent</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl font-bold hover:text-gray-200 transition"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block font-bold mb-2 text-gray-900">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full input input-bordered focus:input-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2 text-gray-900">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full input input-bordered focus:input-primary"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 text-gray-900">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full input input-bordered focus:input-primary"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Talent Category & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2 text-gray-900">Talent Category *</label>
                    <select
                      name="talentCategory"
                      value={formData.talentCategory}
                      onChange={handleChange}
                      className="w-full select select-bordered focus:select-primary"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">-- Select Category --</option>
                      {talentCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-2 text-gray-900">Experience (Years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g., 3"
                      className="w-full input input-bordered focus:input-primary"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block font-bold mb-2 text-gray-900">About Your Talent *</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and your talent journey..."
                    rows="4"
                    className="w-full textarea textarea-bordered focus:textarea-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Portfolio Link */}
                <div>
                  <label className="block font-bold mb-2 text-gray-900">Portfolio Link</label>
                  <input
                    type="url"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                    placeholder="https://myportfolio.com"
                    className="w-full input input-bordered focus:input-primary"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Social Media */}
                <div>
                  <label className="block font-bold mb-2 text-gray-900">Social Media Profile</label>
                  <input
                    type="url"
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourprofile"
                    className="w-full input input-bordered focus:input-primary"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Checkbox */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="checkbox checkbox-primary mt-1"
                      required
                      disabled={isSubmitting}
                    />
                    <label className="cursor-pointer text-sm text-gray-700">
                      <span className="font-semibold">I agree to AnataEvents terms and conditions.</span> 
                      My profile and information can be used for talent hunting purposes and promotion on our platform.
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn btn-primary btn-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="flex-1 btn btn-outline btn-lg"
                  >
                    Clear Form
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="w-full btn btn-ghost"
                >
                  Close
                </button>
              </form>

              {/* Info Box */}
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">✓ What happens after registration?</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Our team reviews your application within 2-3 days</li>
                  <li>• You'll receive approval confirmation via email</li>
                  <li>• Your profile appears in featured talents section</li>
                  <li>• Event organizers discover and book you</li>
                  <li>• Start earning from talent hunt bookings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}