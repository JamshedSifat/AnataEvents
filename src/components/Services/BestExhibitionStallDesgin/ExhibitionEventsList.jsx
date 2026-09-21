import React, { useState, useEffect } from 'react';
import exhibitionEventsData from '../../../../public/ExhibitionStallData/ExhibitionStallData.json';
import ExhibitionEventCard from './ExhibitionEventCard';
import { contentApi } from '../../../services/content';
import { mapServiceEntry } from '../../../services/mappers';

const ExhibitionEventsList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await contentApi.serviceEntries({ service: 'exhibition-stall-design', page_size: 50 });
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

  const loadEvents = () => {
    try {
      setLoading(true);

      let data = [];
      const savedEvents = localStorage.getItem('exhibitionEvents');

      if (savedEvents) {
        data = JSON.parse(savedEvents);
      } else if (exhibitionEventsData && Array.isArray(exhibitionEventsData)) {
        data = exhibitionEventsData;
        localStorage.setItem('exhibitionEvents', JSON.stringify(data));
      }

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