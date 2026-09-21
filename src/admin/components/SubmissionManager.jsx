import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Check, Eye, Search, Trash2, X } from 'lucide-react';

import Seo from '../../components/Seo';
import { EmptyState, LoadingScreen } from '../../components/ui/States';
import { adminApi, normaliseListPayload } from '../../services/admin';
import { extractError } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import { toast } from 'react-toastify';

/**
 * Review screen for every public submission type (contact messages, bookings,
 * artist applications, talent hunt, vendors, job applications).
 */
const STATUS_LABELS = {
  pending: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-error',
  reviewed: 'badge-info',
};

const listFetcher =
  (endpoint) =>
  async ({ status, search, page }) => {
    const params = { page, page_size: 20 };
    if (status) params.status = status;
    if (search) params.search = search;
    return normaliseListPayload((await endpoint(params)).results ? (await endpoint(params)) : {});
  };

const SubmissionManager = ({
  title,
  description,
  resourceKey,
  endpoint,
  columns,
  showApprove = true,
  showReadToggle = false,
  detailPath = null,
}) => {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(null);

  const params = useMemo(
    () => ({ page, page_size: 20, ...(status ? { status } : {}), ...(search ? { search } : {}) }),
    [page, status, search],
  );

  const { data, loading, refetch } = useApiResource(() => endpoint(params), [JSON.stringify(params)]);
  const items = data?.results || data || [];
  const count = data?.count ?? items.length;
  const numPages = data?.num_pages ?? 1;

  const review = async (item, decision) => {
    setBusy(item.id);
    try {
      const call = decision === 'approved' ? adminApi.approve : adminApi.reject;
      await call(resourceKey, item.id, {});
      toast.success(`Marked as ${decision}.`);
      await refetch();
    } catch (error) {
      toast.error(extractError(error).message);
    } finally {
      setBusy(null);
    }
  };

  const markRead = async (item) => {
    setBusy(item.id);
    try {
      await adminApi.markRead(item.id);
      await refetch();
    } catch (error) {
      toast.error(extractError(error).message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (item) => {
    if (!window.confirm('Delete this submission permanently?')) return;
    setBusy(item.id);
    try {
      await adminApi.removeSubmission(resourceKey, item.id);
      toast.success('Deleted.');
      await refetch();
    } catch (error) {
      toast.error(extractError(error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <Seo title={title} noIndex />
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
              aria-label="Search submissions"
              placeholder="Search…"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-56"
            />
          </div>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingScreen message="Loading submissions…" />
      ) : items.length === 0 ? (
        <EmptyState title="Nothing to review" message="New submissions from the website appear here." />
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="table w-full">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover">
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.key === 'status' ? (
                        <span className={`badge ${STATUS_LABELS[item.status] || 'badge-ghost'}`}>{item.status}</span>
                      ) : column.key === 'created_at' ? (
                        (item.created_at || '').slice(0, 16).replace('T', ' ')
                      ) : (
                        item[column.key] || '—'
                      )}
                    </td>
                  ))}
                  <td className="text-right whitespace-nowrap">
                    {detailPath && (
                      <Link to={detailPath.replace(':id', item.id)} className="btn btn-xs btn-ghost" aria-label="View">
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    )}
                    {showApprove && (
                      <>
                        <button
                          type="button"
                          className="btn btn-xs btn-success"
                          disabled={busy === item.id}
                          onClick={() => review(item, 'approved')}
                          aria-label="Approve"
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs btn-ghost text-error"
                          disabled={busy === item.id}
                          onClick={() => review(item, 'rejected')}
                          aria-label="Reject"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </>
                    )}
                    {showReadToggle && !item.is_read && (
                      <button
                        type="button"
                        className="btn btn-xs btn-outline"
                        disabled={busy === item.id}
                        onClick={() => markRead(item)}
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost text-error"
                      disabled={busy === item.id}
                      onClick={() => remove(item)}
                      aria-label="Delete"
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
        <span className="text-sm text-gray-500">{count} result(s)</span>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {numPages || 1}
          </span>
          <button
            type="button"
            className="btn btn-sm"
            disabled={page >= (numPages || 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionManager;
