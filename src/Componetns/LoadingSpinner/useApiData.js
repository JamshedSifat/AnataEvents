import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../services/api";

/**
 * Fetch one API endpoint with loading/error state and optional params.
 * Returns { data, loading, error, reload }.
 */
export default function useApiData(url, params = null, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);
  const paramsKey = params ? JSON.stringify(params) : "";
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(
    async (silent = false) => {
      if (!enabled || !url) return;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await api.get(url, { params: params ? JSON.parse(paramsKey) : undefined });
        if (mounted.current) setData(res.data);
      } catch (err) {
        if (mounted.current) setError(err);
      } finally {
        if (mounted.current) setLoading(false);
      }
    },
    [url, paramsKey, enabled]
  );

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: () => load(true) };
}
