import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { extractError } from '../services/api';
import { createResource } from '../services/admin';

/**
 * Generic admin CRUD hook built on the `/api/admin/<resource>/` endpoints.
 *
 * Every write goes to the server; the hook only mirrors the response locally.
 * A viewer account gets a 403 from the API and a readable toast here.
 */
export function useCrud(resourceKey, { params = {}, autoLoad = true } = {}) {
  const resource = useMemo(() => createResource(resourceKey), [resourceKey]);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ count: 0, num_pages: 1, page: 1 });
  const [loading, setLoading] = useState(autoLoad);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params || {});

  const load = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      setError(null);
      try {
        const payload = await resource.list({ ...JSON.parse(paramsKey), ...overrides });
        setItems(payload.results);
        setMeta({ count: payload.count, num_pages: payload.num_pages, page: payload.page });
        return payload.results;
      } catch (err) {
        const parsed = extractError(err);
        setError(parsed);
        toast.error(parsed.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [resource, paramsKey],
  );

  useEffect(() => {
    if (autoLoad) load();
         
  }, [autoLoad, load]);

  const handleError = useCallback((err, fallback) => {
    const parsed = extractError(err);
    toast.error(parsed.message || fallback);
    return parsed;
  }, []);

  const create = useCallback(
    async (payload, config) => {
      setSaving(true);
      try {
        const created = await resource.create(payload, config);
        setItems((prev) => [created, ...prev]);
        toast.success('Saved successfully.');
        return created;
      } catch (err) {
        handleError(err, 'Could not save.');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [resource, handleError],
  );

  const update = useCallback(
    async (id, payload, config) => {
      setSaving(true);
      try {
        const updated = await resource.update(id, payload, config);
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        toast.success('Changes saved.');
        return updated;
      } catch (err) {
        handleError(err, 'Could not update.');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [resource, handleError],
  );

  const remove = useCallback(
    async (id) => {
      try {
        await resource.remove(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success('Deleted.');
        return true;
      } catch (err) {
        handleError(err, 'Could not delete.');
        return false;
      }
    },
    [resource, handleError],
  );

  const bulkDelete = useCallback(
    async (ids) => {
      try {
        await resource.bulkDelete(ids);
        setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
        toast.success(`Deleted ${ids.length} item(s).`);
        return true;
      } catch (err) {
        handleError(err, 'Could not delete the selected items.');
        return false;
      }
    },
    [resource, handleError],
  );

  const togglePublish = useCallback(
    async (item) => {
      try {
        const updated = item.is_published ? await resource.unpublish(item.id) : await resource.publish(item.id);
        setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row)));
        toast.success(item.is_published ? 'Unpublished.' : 'Published.');
        return updated;
      } catch (err) {
        handleError(err, 'Could not change the publish state.');
        return null;
      }
    },
    [resource, handleError],
  );

  const reorder = useCallback(
    async (orderedItems) => {
      const payload = orderedItems.map((item, index) => ({ id: item.id, order: index }));
      setItems(orderedItems.map((item, index) => ({ ...item, order: index })));
      try {
        await resource.reorder(payload);
        return true;
      } catch (err) {
        handleError(err, 'Could not save the new order.');
        return false;
      }
    },
    [resource, handleError],
  );

  return {
    resource,
    items,
    setItems,
    meta,
    loading,
    saving,
    error,
    load,
    create,
    update,
    remove,
    bulkDelete,
    togglePublish,
    reorder,
  };
}

export default useCrud;
