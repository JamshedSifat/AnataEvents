import React from "react";
import { Link } from "react-router";
import { ChevronRight, Sparkles } from "lucide-react";

const BookAnArtists = () => {
const categories = [
  {
    name: "Singer",
    icon: "🎤",
    link: "/bookAnArtists/singer",
    description: "Professional vocalists for all occasions",
    artists: "50+ Artists"
  },
  {
    name: "DJ",
    icon: "🎧",
    link: "/bookAnArtists/dj",
    description: "Energy and music for your party",
    artists: "30+ DJs"
  },
  {
    name: "Comedian",
    icon: "😂",
    link: "/bookAnArtists/comedian",
    description: "Laughter and entertainment guaranteed",
    artists: "25+ Comedians"
  },
  {
    name: "Magician",
    icon: "🎩",
    link: "/bookAnArtists/magician",
    description: "Amazing illusions and wonder",
    artists: "20+ Magicians"
  },
  {
    name: "Dancer",
    icon: "💃",
    link: "/bookAnArtists/dancer",
    description: "Professional dancers for events and shows",
    artists: "40+ Dancers"
  }
];

  return (
    <div className="min-h-screen bg-white">

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/30 hover:border-primary/60 hover:bg-primary/20 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">BOOK YOUR ENTERTAINMENT</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              Book Your Favorite <span className="text-primary">Artist</span>
            </h1>

            <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
              Choose from different types of artists and performers for your special event
            </p>

            <p className="text-sm text-gray-500">
              Professional performers available for weddings, corporate events, festivals, and celebrations
            </p>
          </div>

       

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="group"
              >
                <div className="bg-white border-2 border-orange-600  p-8 rounded-2xl h-full flex flex-col justify-between hover:border-primary hover:shadow-xl hover:shadow-primary/15 transition-all duration-300">

                  {/* Top Section */}
                  <div>
                    <div className="text-6xl mb-4 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                      {cat.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                      {cat.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3">
                      {cat.description}
                    </p>
                  </div>

               

                </div>
              </Link>
            ))}
          </div>

         
          

        </div>
      </div>
    </div>
  );
};

export default BookAnArtists;