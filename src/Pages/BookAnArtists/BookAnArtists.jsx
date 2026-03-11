import React from "react";
import { Link } from "react-router";

const BookAnArtists = () => {

  const categories = [
    { name: "Singer", icon: "🎤", link: "/bookAnArtists/singer" },
    { name: "DJ", icon: "🎧", link: "/bookAnArtists/dj" },
    { name: "Comedian", icon: "😂", link: "/bookAnArtists/comedian" },
    { name: "Magician", icon: "🎩", link: "/magician" },
    { name: "Band", icon: "🎸", link: "/band" }
  ];

  return (
    <div className="pt-20 pb-16 bg-base-200">

      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">

          <h1 className="text-4xl font-bold text-primary mb-3">
            Book Your Favorite Artist
          </h1>

          <p className="text-base-content/70">
            Choose from different types of artists for your special event
          </p>

        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">

          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="bg-base-100 p-6 rounded-xl shadow text-center hover:shadow-lg hover:scale-105 transition"
            >

              <div className="text-4xl mb-3">
                {cat.icon}
              </div>

              <h3 className="text-lg font-semibold">
                {cat.name}
              </h3>

            </Link>
          ))}

        </div>

      </div>

    </div>
  );
};

export default BookAnArtists;