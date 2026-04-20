// File: src/Pages/TalentHunt/TalentHuntFeature.jsx (Fixed for Vercel)
import React, { useState, useEffect } from 'react';

export default function TalentHuntFeature() {
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [talentShowcase, setTalentShowcase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadTalents();
    
    // ✅ Use custom event instead of localStorage
    window.addEventListener('talentsUpdated', loadTalents);
    return () => window.removeEventListener('talentsUpdated', loadTalents);
  }, []);

  const handleStorageChange = (e) => {
    if (e.key === 'talents') {
      loadTalents();
    }
  };

  const loadTalents = () => {
    try {
      setLoading(true);
      let data = [];
      
      // ✅ Check if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTalents = localStorage.getItem('talents');
        
        if (savedTalents) {
          try {
            data = JSON.parse(savedTalents);
            if (Array.isArray(data)) {
              data = data.filter(talent => talent.approvalStatus === 'approved');
            } else {
              data = [];
            }
          } catch (parseError) {
            console.error('Error parsing talents:', parseError);
            data = [];
          }
        }
      }

      setTalentShowcase(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error loading talents:', err);
      setError('Failed to load talents. Please refresh the page.');
      setLoading(false);
    }
  };

  // ✅ Safe category generation
  const categories = talentShowcase.length > 0
    ? ['all', ...new Set(talentShowcase.map(t => t.talentCategory || 'Other'))]
    : ['all'];

  const filteredTalents = filterCategory === 'all' 
    ? talentShowcase 
    : talentShowcase.filter(t => (t.talentCategory || 'Other') === filterCategory);

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
          <p className="text-xl font-bold text-gray-600">Loading featured talents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading Talents</h3>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={loadTalents}
              className="mt-4 btn btn-sm btn-primary"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (talentShowcase.length === 0) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg inline-block">
            <h3 className="text-xl font-bold text-yellow-600 mb-2">No Talents Available</h3>
            <p className="text-gray-700">Featured talents coming soon!</p>
            <button
              onClick={loadTalents}
              className="mt-4 btn btn-sm btn-outline"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      {/* Talent Showcase */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 text-center text-gray-900">
            Featured Talents <span className="text-primary">({filteredTalents.length})</span>
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Discover our amazing performers and talented artists
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  filterCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category === 'all' ? 'All Talents' : category}
              </button>
            ))}
          </div>
        </div>
        
        {filteredTalents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTalents.map((talent) => (
              <div
                key={talent._id || Math.random()}
                onClick={() => setSelectedTalent(talent)}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer transform hover:-translate-y-2 group"
              >
                {/* Card Header with Category */}
                <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-center text-white relative">
                  <div className="text-5xl mb-2">🎭</div>
                  <h3 className="text-lg font-bold group-hover:text-gray-100">{talent.fullName || 'Unknown'}</h3>
                  <p className="text-xs text-white/80">{talent.talentCategory || 'Other'}</p>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Experience Badge */}
                  <div className="mb-3">
                    <p className="text-sm font-bold text-green-600 bg-green-100 inline-block px-3 py-1 rounded-full">
                      {talent.experience || '0'} years experience
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {talent.bio || 'No bio provided'}
                  </p>

                  {/* Quick Info */}
                  <div className="space-y-2 mb-4 text-xs text-gray-600">
                    {talent.portfolioLink && (
                      <p className="flex items-center gap-2">
                        <span>🔗</span> Portfolio available
                      </p>
                    )}
                    {talent.socialMedia && (
                      <p className="flex items-center gap-2">
                        <span>📱</span> Social available
                      </p>
                    )}
                  </div>

                  {/* Click to View More */}
                  <button className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-bold hover:bg-pink-600 transition text-sm group-hover:shadow-lg">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No talents in this category yet</p>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          How It <span className='text-primary'>Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-purple-600">1</span>
            </div>
            <h3 className="font-bold text-center mb-2">Register</h3>
            <p className="text-gray-600 text-sm text-center">Fill in your details and showcase your talent</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-pink-600">2</span>
            </div>
            <h3 className="font-bold text-center mb-2">Verification</h3>
            <p className="text-gray-600 text-sm text-center">Our team reviews your profile</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="font-bold text-center mb-2">Get Discovered</h3>
            <p className="text-gray-600 text-sm text-center">Event organizers find your profile</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-green-600">4</span>
            </div>
            <h3 className="font-bold text-center mb-2">Book Events</h3>
            <p className="text-gray-600 text-sm text-center">Get opportunities and earn</p>
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedTalent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎭</span>
                <div>
                  <h2 className="text-2xl font-bold">{selectedTalent.fullName || 'Unknown'}</h2>
                  <p className="text-purple-100">{selectedTalent.talentCategory || 'Other'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTalent(null)}
                className="text-2xl font-bold hover:text-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              
              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">⭐</p>
                  <p className="text-gray-600 text-sm">Talent Category</p>
                  <p className="font-semibold text-gray-900">{selectedTalent.talentCategory || 'Other'}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">📅</p>
                  <p className="text-gray-600 text-sm">Experience</p>
                  <p className="font-semibold text-gray-900">{selectedTalent.experience || '0'} years</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">✓</p>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="font-semibold text-gray-900">Verified</p>
                </div>
              </div>

              {/* Full Bio */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">📝 About</h3>
                <p className="text-gray-700 leading-relaxed">{selectedTalent.bio || 'No bio provided'}</p>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-gray-900">📞 Contact Information</h3>
                <div className="space-y-2 text-sm">
                  {selectedTalent.email ? (
                    <p>
                      <span className="font-semibold text-gray-600">Email:</span> 
                      <a 
                        href={`mailto:${selectedTalent.email}`} 
                        className="text-primary hover:underline ml-2 break-all"
                      >
                        {selectedTalent.email}
                      </a>
                    </p>
                  ) : null}
                  {selectedTalent.phone ? (
                    <p>
                      <span className="font-semibold text-gray-600">Phone:</span> 
                      <a 
                        href={`tel:${selectedTalent.phone}`} 
                        className="text-primary hover:underline ml-2"
                      >
                        {selectedTalent.phone}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Social & Links */}
              {(selectedTalent.portfolioLink || selectedTalent.socialMedia) && (
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">🔗 Connect</h3>
                  <div className="flex gap-3 flex-wrap">
                    {selectedTalent.portfolioLink && (
                      <a
                        href={selectedTalent.portfolioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition text-sm"
                      >
                        🌐 Portfolio
                      </a>
                    )}
                    {selectedTalent.socialMedia && (
                      <a
                        href={selectedTalent.socialMedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 font-semibold transition text-sm"
                      >
                        📷 Social Media
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button 
                  onClick={() => setSelectedTalent(null)}
                  className="flex-1 btn btn-primary"
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
}