import React, { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  Tv,
} from "lucide-react";

const Comedian = () => {
  const [comedians, setComedians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComedians = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch local JSON data
        const response = await fetch("../../../../public/ComedianData/comedians.json");
        if (!response.ok) {
          throw new Error("Failed to fetch comedian data");
        }
        const data = await response.json();
        setComedians(data);
      } catch (err) {
        console.error("Error fetching comedians:", err);
        setError("Failed to load comedian data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComedians();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium text-lg">
            Loading comedians...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-primary p-6 rounded-lg shadow-sm max-w-md">
          <h3 className="font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
    

      {/* Comedians Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comedians.map((comedian) => (
            <div
              key={comedian.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden bg-gray-200">
                <img
                  src={comedian.image}
                  alt={comedian.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x400?text=No+Image";
                  }}
                />

                {/* Top Badge */}
                <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                  <Star className="w-4 h-4 fill-current" />
                  {comedian.rating}
                </div>

                {/* Tour Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      comedian.tour_status === "Active"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {comedian.tour_status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {comedian.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">
                    {comedian.city}, {comedian.country}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-gray-700 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {comedian.bio}
                </p>

                {/* Famous Show */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Famous Show
                  </p>
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    <Tv className="w-4 h-4 text-primary" />
                    {comedian.famous_show}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 uppercase">Experience</p>
                    <p className="font-bold text-primary text-lg">
                      {comedian.experience_years}y
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 uppercase">Followers</p>
                    <p className="font-bold text-primary text-lg">
                      {comedian.followers}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 uppercase">Awards</p>
                    <p className="font-bold text-primary text-lg">
                      {comedian.awards.length}
                    </p>
                  </div>
                </div>

                {/* Genres */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    Genres
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {comedian.genres.map((genre, idx) => (
                      <span
                        key={idx}
                        className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comedian;