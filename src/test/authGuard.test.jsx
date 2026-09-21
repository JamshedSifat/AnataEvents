import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '../auth/Context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { LEGACY_STORAGE_KEYS, purgeLegacyStorage } from '../services/api';

/**
 * Regression test for the old, forgeable demo login: setting the historical
 * localStorage keys must NOT grant access to the dashboard.
 */
describe('admin access is server-verified', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('purges the legacy localStorage keys', () => {
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, '{"role":"Super Admin"}'));
    purgeLegacyStorage();
    LEGACY_STORAGE_KEYS.forEach((key) => expect(localStorage.getItem(key)).toBeNull());
  });

  it('does not let a forged localStorage flag through ProtectedRoute', async () => {
    localStorage.setItem('admin', JSON.stringify({ email: 'admin@ananta.com', role: 'Super Admin' }));
    localStorage.setItem('token', 'fake-token');

    // The API rejects the refresh attempt: no cookie, no session.
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Invalid token' }),
    });

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <div>Secret dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<div>Login page</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('Login page')).toBeInTheDocument());
    expect(screen.queryByText('Secret dashboard')).not.toBeInTheDocument();
  });
});
