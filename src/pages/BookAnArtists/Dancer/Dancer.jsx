import React, { useState, useEffect } from 'react';
import { contentApi } from '../../../services/content';
import { mapArtist } from '../../../services/mappers';

const Dancer = () => {
  const [dancers, setDancers] = useState([]);
  const [selectedDancer, setSelectedDancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await contentApi.artists({ category: 'dancer', page_size: 100 });
        if (active) setDancers(data.map(mapArtist));
      } catch {
        if (active) setDancers([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="text-center py-12">Loading...</p>;
  }

  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 via-base-200 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-base-content">
            Our <span className="text-primary">Elite Dancers</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover our talented, professional dancers, specializing in diverse styles to create unforgettable performances for every occasion.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dancers.map((dancer) => (
            <div key={dancer._id || dancer.id} className="card shadow-xl hover:scale-105 transition">
              <figure className="relative">
                <img src={dancer.image} alt={dancer.name} className="h-56 w-full object-cover" />
                <span className="absolute top-3 left-3 bg-primary text-white px-2 py-1 text-sm rounded">
                  {dancer.category}
                </span>
              </figure>

              <div className="card-body">
                <h3 className="card-title">
                  {dancer.name}
                  <span className="badge badge-primary ml-2">
                    ⭐ {dancer.rating}
                  </span>
                </h3>

                <p className="text-sm text-gray-600">
                  {dancer.famous_for}
                </p>

                <div className="flex justify-between mt-4 text-sm">
                  <p>🕒 {dancer.experience_years} yrs</p>
                  <button
                    onClick={() => setSelectedDancer(dancer)}
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
        {selectedDancer && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
            <div className="bg-white max-w-3xl w-full rounded-lg">
              <img
                src={selectedDancer.image}
                alt={selectedDancer.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedDancer.name}
                </h2>

                <p className="text-gray-600 mb-4">
                  {selectedDancer.famous_for}
                </p>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <p><b>Category:</b> {selectedDancer.category}</p>
                  <p><b>Status:</b> {selectedDancer.status}</p>
                  <p><b>Experience:</b> {selectedDancer.experience_years} years</p>
                  <p><b>Media:</b> {selectedDancer.media_presence}</p>
                </div>

                {/* Styles */}
                <div className="mb-4">
                  <h4 className="font-bold">Styles</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDancer.styles.map((style, i) => (
                      <span key={i} className="badge badge-outline">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Awards */}
                {selectedDancer.awards?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-bold">Awards</h4>
                    <ul className="list-disc ml-5 text-sm">
                      {selectedDancer.awards.map((award, i) => (
                        <li key={i}>{award}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setSelectedDancer(null)}
                  className="btn btn-primary w-full mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dancer;