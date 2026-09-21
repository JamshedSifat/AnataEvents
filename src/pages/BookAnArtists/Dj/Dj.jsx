import React, { useEffect, useState } from 'react';
import { contentApi } from '../../../services/content';
import { mapArtist } from '../../../services/mappers';

const Dj = () => {
  const [djs, setDjs] = useState([]);
  const [selectedDj, setSelectedDj] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await contentApi.artists({ category: 'dj', page_size: 100 });
        if (active) setDjs(data.map(mapArtist));
      } catch {
        if (active) setDjs([]);
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
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10">Top Bangladeshi DJs</h1>

        {loading && <p className="text-center text-primary">Loading DJs...</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {djs.map((dj) => (
            <div
              key={dj._id || dj.id}
              className="card shadow-xl hover:scale-105 transition duration-300"
            >
              <figure className="relative">
                <img
                  src={dj.image}
                  alt={dj.name}
                  className="h-56 w-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-primary text-white px-2 py-1 text-sm rounded">
                  {dj.genre}
                </span>
              </figure>

              <div className="card-body">
                <h3 className="card-title">
                  {dj.name}
                  <span className="badge badge-primary ml-2">⭐ {dj.rating}</span>
                </h3>

                <p className="text-sm text-gray-600">{dj.famous_for}</p>

                <div className="flex justify-between mt-4 text-sm">
                  <p>🕒 {dj.experience_years} yrs</p>
                  <button
                    onClick={() => setSelectedDj(dj)}
                    className="btn btn-primary btn-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedDj && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl relative">
              <button
                onClick={() => setSelectedDj(null)}
                className="absolute top-3 right-3 text-white bg-black/70 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>

              <img
                src={selectedDj.image}
                alt={selectedDj.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold mb-2">{selectedDj.name}</h2>
                <p className="text-gray-600 mb-4">{selectedDj.famous_for}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><b>Genre:</b> {selectedDj.genre}</p>
                  <p><b>Rating:</b> ⭐ {selectedDj.rating}</p>
                  <p><b>Experience:</b> {selectedDj.experience_years} yrs</p>
                  <p><b>City:</b> {selectedDj.city}</p>
                  <p><b>Country:</b> {selectedDj.country}</p>
                </div>

                {selectedDj.awards?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Awards:</h4>
                    <ul className="list-disc ml-5 text-sm">
                      {selectedDj.awards.map((award, i) => (
                        <li key={i}>{award}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDj.media_presence && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Media Presence:</h4>
                    <p className="text-sm">{selectedDj.media_presence}</p>
                  </div>
                )}

                {selectedDj.social_followers && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Social Followers:</h4>
                    <p className="text-sm">{selectedDj.social_followers}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dj;