// File: src/Components/CorporateEventsList.jsx — corporate events from the API
import React, { useState, useEffect } from 'react';
import CorporateEventCard from './CorporateEventCard';
import { api, toList } from '../../../services/api';
import { ErrorState, EmptyState } from '../../../Componetns/LoadingSpinner/AsyncState';

const CorporateEventsList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = () => {
    setLoading(true);
    setError(null);
    api
      .get('/service-entries/', { params: { type: 'corporate_event', page_size: 24 } })
      .then((res) => {
        const data = toList(res.data);
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch(() => setError('Failed to load corporate events.'))
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
    <div className="   sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        

        

        {/* All Events */}
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
            All <span className="text-primary">Services</span>
          </h2>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {filteredEvents.map(event => (
                <CorporateEventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-base sm:text-lg text-gray-600">
                No events found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CorporateEventsList;