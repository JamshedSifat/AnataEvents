import React, { useState, useEffect } from "react";
import SingerCard from "./SingerCard";
import SingerModal from "./SingerModal";

const Singer = () => {

  const [singers, setSingers] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [selectedSinger, setSelectedSinger] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/SingersData/singersData.json");
        const data = await res.json();

        setSingers(data.singers || []);

        const saved = JSON.parse(
          localStorage.getItem("favoriteBangladeshiSingers") || "[]"
        );
        setFavorites(saved);

      } catch (err) {
        setError("Failed to load singers");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Toggle Favorite
  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    setFavorites(updated);
    localStorage.setItem(
      "favoriteBangladeshiSingers",
      JSON.stringify(updated)
    );
  };

  // Filter singers
  const filteredSingers = singers.filter((s) => {

    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase());

    const matchGenre =
      genre === "All" || s.genre.toLowerCase().includes(genre.toLowerCase());

    return matchSearch && matchGenre;

  });

  if (loading) return <h2 className="text-center mt-20">Loading...</h2>;

  if (error) return <h2 className="text-center mt-20">{error}</h2>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">

   {/* Header Section */}
<div className="text-center mb-12">

  <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
    🇧🇩 Book Bangladeshi Singers
  </h1>

  <p className="text-gray-500 max-w-xl mx-auto">
    Find and book talented Bangladeshi singers for your wedding, concert, or special event.
  </p>

  <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto mt-4 rounded"></div>

</div>


{/* Search + Filter Section */}
<div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">

  {/* Search */}
  <div className="relative w-full md:w-96">

    <input
      type="text"
      placeholder="Search singer..."
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border border-gray-300 rounded-full px-5 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
    />

    <span className="absolute left-3 top-3 text-gray-400">
      🔍
    </span>

  </div>


  {/* Filter */}
  <select
    onChange={(e) => setGenre(e.target.value)}
    className="border border-gray-300 rounded-full px-5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
  >
    <option>All</option>
    <option>Pop</option>
    <option>Rock</option>
    <option>Folk</option>
  </select>

</div>

      {/* Singer Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">

        {filteredSingers.map((singer) => (
          <SingerCard
            key={singer.id}
            singer={singer}
            onBookNow={() => setSelectedSinger(singer)}
            onToggleFavorite={() => toggleFavorite(singer.id)}
            isFavorite={favorites.includes(singer.id)}
          />
        ))}

      </div>

      {/* Booking Modal */}
      {selectedSinger && (
        <SingerModal
          singer={selectedSinger}
          onClose={() => setSelectedSinger(null)}
        />
      )}

    </div>
  );
};

export default Singer;