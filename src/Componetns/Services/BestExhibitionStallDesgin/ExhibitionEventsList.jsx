import React, { useState, useEffect } from 'react';
import ExhibitionEventCard from './ExhibitionEventCard';
import { api, toList } from '../../../services/api';

const ExhibitionEventsList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = () => {
    setLoading(true);
    setError(null);
    api
      .get('/service-entries/', { params: { type: 'exhibition_stall', page_size: 24 } })
      .then((res) => {
        const data = toList(res.data);
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch(() => setError('Failed to load exhibition services.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">

        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
          All <span className="text-primary">Exhibition Services</span>
        </h2>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2  justify-items-center">
            {filteredEvents.map(event => (
              <ExhibitionEventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-lg text-gray-600">
              No exhibition events found.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExhibitionEventsList;