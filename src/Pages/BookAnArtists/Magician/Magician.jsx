import React, { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  Wand2,
  Globe,
  Sparkles,
} from "lucide-react";

const Magician = () => {
  const [magicians, setMagicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMagicians();
  }, []);

  const fetchMagicians = () => {
    try {
      setLoading(true);
      setError(null);

      // Load from localStorage (Admin data)
      const savedMagicians = localStorage.getItem('magicians');
      if (savedMagicians) {
        const data = JSON.parse(savedMagicians);
        setMagicians(data);
        setLoading(false);
        return;
      }

      // Fallback to JSON file
      fetch("/MagiciansData/MagiciansData.json")
        .then((res) => res.json())
        .then((data) => {
          setMagicians(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load magician data");
          setLoading(false);
        });
    } catch (err) {
      console.error("Error fetching magicians:", err);
      setError("Failed to load magician data. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">
            Loading Bangladesh's finest magicians...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="bg-red-50 border-l-4 border-primary p-8 rounded-xl shadow-lg max-w-md">
          <h3 className="font-bold text-gray-900 mb-2 text-lg">Oops!</h3>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex gap-4 items-start">
            <div className="w-1.5 h-12 bg-primary rounded"></div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Bangladesh Best <span className="text-primary">Magician</span>
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Discover the most talented illusionists and performers bringing magic to life
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Magicians Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        {magicians.length === 0 ? (
          <div className="text-center py-12">
            <Wand2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              No magicians found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {magicians.map((magician) => (
              <div
                key={magician._id || magician.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-primary/30"
              >
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-purple-200 to-indigo-200">
                  <img
                    src={magician.image}
                    alt={magician.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x400?text=Magician";
                    }}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      {magician.rating}
                    </div>
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {magician.tour_status}
                    </div>
                  </div>

                  {/* Country Flag */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-lg">
                    <span className="text-2xl">🇧🇩</span>
                  </div>

                  {/* Sparkle Animation */}
                  <div className="absolute top-2 right-16 animate-pulse">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {magician.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{magician.city}</span>
                  </div>

                  {/* Language */}
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm">{magician.language}</span>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-700 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {magician.bio}
                  </p>

                  {/* Famous Show */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Signature Show
                    </p>
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-primary" />
                      {magician.famous_show}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-purple-50 rounded-lg p-3 text-center hover:bg-primary/5 transition-colors">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Experience
                      </p>
                      <p className="font-bold text-primary text-lg">
                        {magician.experience_years}y
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center hover:bg-primary/5 transition-colors">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Followers
                      </p>
                      <p className="font-bold text-primary text-lg">
                        {magician.followers}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center hover:bg-primary/5 transition-colors">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Awards
                      </p>
                      <p className="font-bold text-primary text-lg">
                        {magician.awards?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Magic Types */}
                  {magician.genres && magician.genres.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                        Magic Specialties
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {magician.genres.map((genre, idx) => (
                          <span
                            key={idx}
                            className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium hover:bg-primary/20 transition-colors"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Magician;