import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';

import useCrud from '../../hooks/useCrud';
import { EmptyState, LoadingScreen } from '../../components/ui/States';

/**
 * Config-driven CRUD screen for every `/api/admin/<resource>/` endpoint.
 *
 * Handles listing, searching, pagination, create/edit (JSON or multipart when a
 * file field is present), publish toggling, reordering and bulk delete. All
 * writes are server-enforced: a viewer account receives 403 and a toast.
 */
const columnValue = (item, column) => {
  const value = column.render ? column.render(item) : item[column.key];
  if (value === null || value === undefined || value === '') return '—';
  if (column.type === 'boolean') return value ? 'Yes' : 'No';
  if (column.type === 'date' && typeof value === 'string') return value.slice(0, 10);
  return String(value);
};

const initialFormState = (fields, item) =>
  fields.reduce((acc, field) => {
    if (item) {
      acc[field.name] = item[field.name] ?? '';
      if (field.type === 'file') acc[field.name] = null;
      if (field.type === 'checkbox') acc[field.name] = Boolean(item[field.name]);
      return acc;
    }
    acc[field.name] = field.default ?? (field.type === 'checkbox' ? field.default ?? false : '');
    return acc;
  }, {});

const buildPayload = (fields, form) => {
  const payload = new FormData();
  let hasFile = false;
  fields.forEach((field) => {
    const value = form[field.name];
    if (field.type === 'file') {
      if (value instanceof File) {
        payload.append(field.name, value);
        hasFile = true;
      }
      return;
    }
    if (field.type === 'checkbox') {
      payload.append(field.name, value ? 'true' : 'false');
      return;
    }
    if (field.type === 'json') {
      if (value === '' || value === null || value === undefined) return;
      try {
        payload.append(field.name, JSON.stringify(typeof value === 'string' ? JSON.parse(value) : value));
      } catch {
        payload.append(field.name, value);
      }
      return;
    }
    if (value === '' && field.required === false) return;
    payload.append(field.name, value === null || value === undefined ? '' : value);
  });

  if (!hasFile) {
    // Plain JSON keeps the request readable in the browser network tab.
    const json = {};
    payload.forEach((value, key) => {
      if (key === 'is_published') json[key] = value === 'true';
      else json[key] = value;
    });
    return { payload: json, isMultipart: false };
  }
  return { payload, isMultipart: true };
};

const ResourceManager = ({
  resourceKey,
  title,
  description,
  columns = [],
  fields = [],
  searchPlaceholder = 'Search…',
  filters = [],
  canCreate = true,
  canReorder = true,
  pageSize = 12,
  itemLabel = 'item',
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const params = useMemo(() => {
    const base = { page, page_size: pageSize };
    if (search.trim()) base.search = search.trim();
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) base[key] = value;
    });
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, JSON.stringify(filterValues)]);

  const crud = useCrud(resourceKey, { params });
  const { items, meta, loading, saving } = crud;

  const openCreate = () => {
    setEditing({ __new: true });
    setForm(initialFormState(fields, null));
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm(initialFormState(fields, item));
  };

  const closeModal = () => {
    setEditing(null);
    setForm({});
  };

  const submit = async (event) => {
    event.preventDefault();
    const { payload, isMultipart } = buildPayload(fields, form);
    const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;
    if (editing?.__new) {
      const created = await crud.create(payload, config);
      if (created) closeModal();
    } else if (editing) {
      const updated = await crud.update(editing.id, payload, config);
      if (updated) closeModal();
    }
  };

  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));

  const move = (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    crud.reorder(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-56"
            />
          </div>
          {filters.map((filter) => (
            <select
              key={filter.name}
              aria-label={filter.label}
              value={filterValues[filter.name] ?? ''}
              onChange={(event) => {
                setPage(1);
                setFilterValues((prev) => ({ ...prev, [filter.name]: event.target.value }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
          {canCreate && (
            <button type="button" onClick={openCreate} className="btn btn-primary btn-sm gap-2">
              <Plus className="w-4 h-4" aria-hidden="true" /> New {itemLabel}
            </button>
          )}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <span className="text-sm text-red-800">{selected.length} selected</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-error"
              onClick={async () => {
                const ok = await crud.bulkDelete(selected);
                if (ok) setSelected([]);
              }}
            >
              Delete selected
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setSelected([])}>
              Clear
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingScreen message="Loading content…" />
      ) : items.length === 0 ? (
        <EmptyState title={`No ${itemLabel}s yet`} message="Create the first one to see it on the website." />
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-10">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={selected.length === items.length && items.length > 0}
                    onChange={(event) => setSelected(event.target.checked ? items.map((item) => item.id) : [])}
                  />
                </th>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="hover">
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${item.title || item.name || item.id}`}
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className={column.className || ''}>
                      {column.type === 'image' ? (
                        item.image_src || item.image_url ? (
                          <img
                            src={item.image_src || item.image_url}
                            alt={item.image_alt || item.title || item.name || 'preview'}
                            className="h-10 w-14 object-cover rounded"
                            loading="lazy"
                          />
                        ) : (
                          '—'
                        )
                      ) : column.type === 'publish' ? (
                        <button
                          type="button"
                          onClick={() => crud.togglePublish(item)}
                          className={`badge ${item.is_published ? 'badge-success' : 'badge-ghost'}`}
                        >
                          {item.is_published ? 'Published' : 'Draft'}
                        </button>
                      ) : (
                        columnValue(item, column)
                      )}
                    </td>
                  ))}
                  <td className="text-right whitespace-nowrap">
                    {canReorder && (
                      <div className="join mr-2">
                        <button
                          type="button"
                          className="btn btn-xs join-item"
                          aria-label="Move up"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs join-item"
                          aria-label="Move down"
                          onClick={() => move(index, 1)}
                          disabled={index === items.length - 1}
                        >
                          ↓
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost"
                      aria-label="Edit"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost text-error"
                      aria-label="Delete"
                      onClick={() => {
                        if (window.confirm(`Delete this ${itemLabel}? This cannot be undone.`)) crud.remove(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {meta.count} {itemLabel}
          {meta.count === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {meta.num_pages || 1}
          </span>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setPage((prev) => (prev < (meta.num_pages || 1) ? prev + 1 : prev))}
            disabled={page >= (meta.num_pages || 1)}
          >
            Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={submit} className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editing.__new ? `New ${itemLabel}` : `Edit ${itemLabel}`}
              </h2>

              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor={`field-${field.name}`}>
                    {field.label}
                    {field.required ? ' *' : ''}
                  </label>
                  {field.type === 'textarea' || field.type === 'json' ? (
                    <textarea
                      id={`field-${field.name}`}
                      rows={field.rows || 4}
                      value={form[field.name] ?? ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={`field-${field.name}`}
                      value={form[field.name] ?? ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required={field.required}
                    >
                      <option value="">—</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <input
                      id={`field-${field.name}`}
                      type="checkbox"
                      checked={Boolean(form[field.name])}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.checked }))}
                      className="checkbox checkbox-primary"
                    />
                  ) : field.type === 'file' ? (
                    <div className="flex items-center gap-3">
                      <input
                        id={`field-${field.name}`}
                        type="file"
                        accept={field.accept || 'image/*'}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, [field.name]: event.target.files?.[0] || null }))
                        }
                        className="file-input file-input-bordered w-full"
                      />
                      <Upload className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </div>
                  ) : (
                    <input
                      id={`field-${field.name}`}
                      type={field.type || 'text'}
                      value={form[field.name] ?? ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required={field.required}
                      placeholder={field.placeholder}
                    />
                  )}
                  {field.help && <p className="text-xs text-gray-500 mt-1">{field.help}</p>}
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManager;
