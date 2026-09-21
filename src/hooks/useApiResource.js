import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { extractError } from '../services/api';

/**
 * Small data-fetching hook: `{data, loading, error, refetch, setData}`.
 *
 * Keeps every page's loading/empty/error handling consistent without pulling in
 * a query library.
 */
export function useApiResource(fetcher, deps = [], { skip = false, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (skip) {
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (mounted.current) setData(result);
      return result;
    } catch (err) {
      if (mounted.current) setError(extractError(err));
      return undefined;
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ...deps]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, error, refetch: load };
}

/** Memoised variant that returns `[]` instead of `null` while loading. */
export function useApiList(fetcher, deps = [], options = {}) {
  const result = useApiResource(fetcher, deps, { initialData: [], ...options });
  const data = useMemo(() => result.data || [], [result.data]);
  return { ...result, data };
}

export default useApiResource;
