import { useState } from 'react';

import Seo from '../../../components/Seo';
import { EmptyState, LoadingScreen } from '../../../components/ui/States';
import { adminApi } from '../../../services/admin.js';
import { useApiResource } from '../../../hooks/useApiResource';

/** Read-only audit trail (super admins only — enforced by the API too). */
const ActionLogs = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useApiResource(() => adminApi.actionLogs({ page, page_size: 25 }), [page]);
  const items = data?.results || [];

  return (
    <div className="space-y-6">
      <Seo title="Audit log" noIndex />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit log</h1>
        <p className="text-sm text-gray-500 mt-1">
          Logins, password changes and every content change made through the dashboard.
        </p>
      </div>

      {loading ? (
        <LoadingScreen message="Loading audit log…" />
      ) : items.length === 0 ? (
        <EmptyState title="No activity recorded yet" />
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="table w-full">
            <thead>
              <tr>
                <th>When</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Detail</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {items.map((entry) => (
                <tr key={entry.id}>
                  <td>{(entry.created_at || '').slice(0, 19).replace('T', ' ')}</td>
                  <td>{entry.actor_email || '—'}</td>
                  <td>
                    <span className="badge badge-outline badge-sm">{entry.action}</span>
                  </td>
                  <td>
                    {entry.target_type}
                    {entry.target_id ? ` #${entry.target_id}` : ''}
                  </td>
                  <td>{entry.description || '—'}</td>
                  <td>{entry.ip_address || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Newer
        </button>
        <button
          type="button"
          className="btn btn-sm"
          disabled={page >= (data?.num_pages || 1)}
          onClick={() => setPage((p) => p + 1)}
        >
          Older
        </button>
      </div>
    </div>
  );
};

export default ActionLogs;
