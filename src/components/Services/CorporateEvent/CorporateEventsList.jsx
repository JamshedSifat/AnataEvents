// File: src/Components/CorporateEventsList.jsx (Removed Search, Category, CTA)
import React, { useState, useEffect } from 'react';
import corporateEventsData from '../../../../public/CorporateEvents/CorporateEvents.json';
import CorporateEventCard from './CorporateEventCard';
import { contentApi } from '../../../services/content';
import { mapServiceEntry } from '../../../services/mappers';

const CorporateEventsList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await contentApi.serviceEntries({ service: 'corporate-events', page_size: 50 });
        if (active) setEvents(data.map(mapServiceEntry));
        setError(null);
      } catch (error) {
        if (active) {
          setEvents([]);
          setError('Could not load these pages right now.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchEvents();
    return () => {
      active = false;
    };
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await contentApi.serviceEntries({ service: 1, page_size: 50 });
      setEvents(data.map(mapServiceEntry));
      setFilteredEvents(data.map(mapServiceEntry));
    } catch (error) {
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

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