import React, { useState, useEffect } from 'react';

export default function TalentHuntFeature() {
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [talentShowcase, setTalentShowcase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch talents from JSON file
  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true);
        const response = await fetch('../../../../public/TalentHunt/TalentHunt.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch talents');
        }
        
        const data = await response.json();
        setTalentShowcase(data.talents);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl font-bold text-gray-600">Loading talents...</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading Talents</h3>
            <p className="text-gray-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      {/* Talent Showcase */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Talents ({talentShowcase.length})</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {talentShowcase.map(talent => (
            <div
              key={talent.id}
              onClick={() => setSelectedTalent(talent)}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden cursor-pointer transform hover:-translate-y-2"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center text-white">
                <p className="text-5xl mb-2">{talent.image}</p>
                <h3 className="text-xl font-bold">{talent.name}</h3>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-sm font-bold text-purple-600 bg-purple-100 inline-block px-3 py-1 rounded-full">
                    {talent.category}
                  </p>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-bold">Experience:</span> {talent.experience}
                </p>

                <p className="text-gray-700 text-sm mb-4">{talent.bio}</p>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500 font-bold">★ {talent.rating}</span>
                  <span className="text-gray-500 text-xs">Verified</span>
                </div>

                {/* Click to View More */}
                <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700 text-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-purple-600 mb-2">1000+</p>
            <p className="text-gray-600">Registered Talents</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-pink-600 mb-2">500+</p>
            <p className="text-gray-600">Events Organized</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">95%</p>
            <p className="text-gray-600">Success Rate</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">24/7</p>
            <p className="text-gray-600">Support Available</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-purple-600">1</span>
            </div>
            <h3 className="font-bold text-center mb-2">Register</h3>
            <p className="text-gray-600 text-sm text-center">Fill in your details and showcase your talent</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-pink-600">2</span>
            </div>
            <h3 className="font-bold text-center mb-2">Verification</h3>
            <p className="text-gray-600 text-sm text-center">Our team reviews your profile</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="font-bold text-center mb-2">Get Discovered</h3>
            <p className="text-gray-600 text-sm text-center">Event organizers find your profile</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedTalent.image}</span>
                <div>
                  <h2 className="text-2xl font-bold">{selectedTalent.name}</h2>
                  <p className="text-purple-100">{selectedTalent.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTalent(null)}
                className="text-2xl font-bold hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              
              {/* Rating and Experience */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-yellow-500 text-2xl font-bold">★ {selectedTalent.rating}</p>
                  <p className="text-gray-600 text-sm">Rating</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedTalent.experience}</p>
                  <p className="text-gray-600 text-sm">Experience</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">✓</p>
                  <p className="text-gray-600 text-sm">Verified</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg text-center">
                  <p className="text-lg font-bold text-pink-600">{selectedTalent.rates}</p>
                  <p className="text-gray-600 text-sm">Rate</p>
                </div>
              </div>

              {/* Video Section */}
              {selectedTalent.videoUrl && (
                <div>
                  <h3 className="text-xl font-bold mb-3 text-purple-600">🎥 Performance Video</h3>
                  <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={selectedTalent.videoUrl}
                      title="Performance Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Audio Section */}
              {selectedTalent.audioUrl && (
                <div>
                  <h3 className="text-xl font-bold mb-3 text-pink-600">🎵 Audio Sample</h3>
                  <audio controls className="w-full bg-gray-200 rounded-lg" style={{ height: '50px' }}>
                    <source src={selectedTalent.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Full Bio */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">📝 About</h3>
                <p className="text-gray-700 leading-relaxed">{selectedTalent.fullBio}</p>
              </div>

              {/* Achievements */}
              {selectedTalent.achievements && selectedTalent.achievements.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3 text-green-600">🏆 Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTalent.achievements.map((achievement, idx) => (
                      <div key={idx} className="bg-green-50 border-l-4 border-green-600 p-3 rounded">
                        <p className="text-gray-700 font-semibold">✓ {achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Links */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-indigo-600">📱 Connect</h3>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href={selectedTalent.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    🌐 Portfolio
                  </a>
                  <a
                    href={selectedTalent.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 font-semibold"
                  >
                    📷 Instagram
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700">
                  💼 Book This Talent
                </button>
                <button
                  onClick={() => setSelectedTalent(null)}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400"
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