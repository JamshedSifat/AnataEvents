import React, { useEffect, useState } from "react";
import FilterBar from "./FilterBar";
import { contentApi } from '../../../services/content';
import { mapArtist } from '../../../services/mappers';

const Singer = () => {
  const [singers, setSingers] = useState([]);
  const [selectedSinger, setSelectedSinger] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await contentApi.artists({ category: 'singer', page_size: 100 });
        if (active) setSingers(data.map(mapArtist));
      } catch {
        if (active) setSingers([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
          Top Bangladeshi Singers
        </h1>
        </div>

      
        {loading && <p className="text-center text-primary">Loading Singers...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-10/12 mx-auto">
          {singers.map((singer) => (
            <div
              key={singer._id || singer.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 overflow-hidden"
            >
              <figure className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={singer.image}
                  alt={singer.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 text-xs sm:text-sm rounded-full shadow">
                  {singer.genre.split(",")[0]}
                </span>
                <span className="absolute top-3 right-3 bg-white/90 text-black px-3 py-1 text-xs sm:text-sm rounded-full shadow font-semibold">
                  ⭐ {singer.rating}
                </span>
              </figure>

              <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-bold">
                  {singer.name}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mt-2 line-clamp-2">
                  {singer.description}
                </p>

                <div className="flex justify-between mt-4 items-center text-sm sm:text-base">
                  <p>🕒 {singer.experience}</p>
                  <button
                    onClick={() => setSelectedSinger(singer)}
                    className="btn btn-primary btn-sm sm:btn-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedSinger && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6">
            <div className="bg-white w-full max-w-3xl rounded-xl overflow-auto shadow-2xl relative max-h-[90vh]">
              <button
                onClick={() => setSelectedSinger(null)}
                className="absolute top-3 right-3 text-white bg-black/70 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>

              <img
                src={selectedSinger.image}
                alt={selectedSinger.name}
                className="w-full h-64 sm:h-80 object-cover"
              />

              <div className="p-4 sm:p-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{selectedSinger.name}</h2>
                <p className="text-gray-600 mb-4">{selectedSinger.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                  <p><b>Genre:</b> {selectedSinger.genre}</p>
                  <p><b>Rating:</b> ⭐ {selectedSinger.rating}</p>
                  <p><b>Experience:</b> {selectedSinger.experience}</p>
                  <p><b>Location:</b> {selectedSinger.location}</p>
                  <p><b>Availability:</b> {selectedSinger.availability}</p>
                </div>

                {selectedSinger.popularSongs?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Popular Songs:</h4>
                    <ul className="list-disc ml-5 text-sm sm:text-base">
                      {selectedSinger.popularSongs.map((song, i) => (
                        <li key={i}>{song}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedSinger.specialties?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Specialties:</h4>
                    <ul className="list-disc ml-5 text-sm sm:text-base">
                      {selectedSinger.specialties.map((sp, i) => (
                        <li key={i}>{sp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedSinger.awards?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Awards:</h4>
                    <ul className="list-disc ml-5 text-sm sm:text-base">
                      {selectedSinger.awards.map((award, i) => (
                        <li key={i}>{award}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedSinger.socialMedia && (
                  <div className="mt-4 text-sm sm:text-base">
                    <h4 className="font-semibold">Social Media:</h4>
                    {selectedSinger.socialMedia.facebook && (
                      <p>Facebook: {selectedSinger.socialMedia.facebook}</p>
                    )}
                    {selectedSinger.socialMedia.instagram && (
                      <p>Instagram: {selectedSinger.socialMedia.instagram}</p>
                    )}
                    {selectedSinger.socialMedia.youtube && (
                      <p>YouTube: {selectedSinger.socialMedia.youtube}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
     
    </section>
  );
};

export default Singer;