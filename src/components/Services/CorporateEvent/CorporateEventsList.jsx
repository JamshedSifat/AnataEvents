// File: src/Components/CorporateEventsList.jsx (Removed Search, Category, CTA)
import React, { useState, useEffect } from 'react';
import corporateEventsData from '../../../../public/CorporateEvents/CorporateEvents.json';
import CorporateEventCard from './CorporateEventCard';

const CorporateEventsList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    try {
      setLoading(true);

      let data = [];
      const savedEvents = localStorage.getItem('corporateEvents');
      
      if (savedEvents) {
        data = JSON.parse(savedEvents);
      } else if (corporateEventsData && Array.isArray(corporateEventsData)) {
        data = corporateEventsData;
        localStorage.setItem('corporateEvents', JSON.stringify(data));
      }

      console.log('Loaded events:', data);
      setEvents(data);
      setFilteredEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
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