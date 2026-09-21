import React, { createContext, useEffect, useMemo, useState } from 'react';

import { contentApi } from '../../services/content';
import { mapService } from '../../services/mappers';

export const ServiceContext = createContext({ services: [], loading: true, error: null, refetch: () => {} });

/**
 * Site-wide services list, loaded once from the API.
 *
 * The old implementation seeded fake services from localStorage which meant a
 * visitor could see stale admin-only data; now the API is the only source.
 */
export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await contentApi.services({ page_size: 50 });
        if (active) {
          setServices(data.map(mapService));
          setError(null);
        }
      } catch (err) {
        if (active) setError('Could not load services.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const value = useMemo(
    () => ({ services, loading, error, refetch: () => setReloadKey((key) => key + 1) }),
    [services, loading, error],
  );

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

export default ServiceProvider;
