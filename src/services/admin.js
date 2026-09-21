/**
 * Admin (staff-only) API.
 *
 * Every helper here hits `/api/admin/...`; the server enforces the role model
 * (viewer = read-only, editor = write, super admin = users/audit log), so the
 * SPA can never grant privileges by itself.
 */
import api from './api';

const list = (response) => {
  const data = response.data;
  return Array.isArray(data) ? data : data?.results || [];
};

/** Resource slug → REST base path. */
export const ADMIN_RESOURCES = {
  services: '/admin/services',
  serviceEntries: '/admin/service-entries',
  heroSlides: '/admin/hero-slides',
  blocks: '/admin/blocks',
  artists: '/admin/artists',
  influencers: '/admin/influencers',
  portfolio: '/admin/portfolio',
  gallery: '/admin/gallery',
  videos: '/admin/videos',
  blogs: '/admin/blogs',
  testimonials: '/admin/testimonials',
  team: '/admin/team',
  faqs: '/admin/faqs',
  jobs: '/admin/jobs',
  events: '/admin/events',
  portfolioImages: '/admin/portfolio-images',
  serviceEntryImages: '/admin/service-entry-images',
  messages: '/admin/messages',
  bookings: '/admin/bookings',
  applications: '/admin/applications',
  talentHunt: '/admin/talent-hunt',
  vendors: '/admin/vendors',
  jobApplications: '/admin/job-applications',
  newsletter: '/admin/newsletter',
  users: '/admin/users',
  actionLogs: '/admin/action-logs',
};

export function normaliseListPayload(data) {
  if (Array.isArray(data)) {
    return { results: data, count: data.length, num_pages: 1, page: 1 };
  }
  return {
    results: data?.results || [],
    count: data?.count ?? 0,
    num_pages: data?.num_pages ?? 1,
    page: data?.page ?? 1,
  };
}

/** Generic CRUD client for one admin resource. */
export function createResource(resourceKey) {
  const base = ADMIN_RESOURCES[resourceKey] || resourceKey;
  return {
    key: resourceKey,
    base,
    list: (params) => api.get(`${base}/`, { params }).then((r) => normaliseListPayload(r.data)),
    get: (id) => api.get(`${base}/${id}/`).then((r) => r.data),
    create: (payload, config) => api.post(`${base}/`, payload, config).then((r) => r.data),
    update: (id, payload, config) => api.patch(`${base}/${id}/`, payload, config).then((r) => r.data),
    remove: (id) => api.delete(`${base}/${id}/`),
    publish: (id) => api.post(`${base}/${id}/publish/`).then((r) => r.data),
    unpublish: (id) => api.post(`${base}/${id}/unpublish/`).then((r) => r.data),
    reorder: (items) => api.post(`${base}/reorder/`, { items }).then((r) => r.data),
    bulkDelete: (ids) => api.post(`${base}/bulk-delete/`, { ids }).then((r) => r.data),
  };
}

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard/stats/').then((r) => r.data),
  settings: () => api.get('/admin/settings/').then((r) => r.data),
  updateSettings: (payload) => api.patch('/admin/settings/update/', payload).then((r) => r.data),

  messages: (params) => api.get('/admin/messages/', { params }).then((r) => normaliseListPayload(r.data)),
  markRead: (id) => api.post(`/admin/messages/${id}/mark-read/`).then((r) => r.data),
  bookings: (params) => api.get('/admin/bookings/', { params }).then((r) => normaliseListPayload(r.data)),
  applications: (params) => api.get('/admin/applications/', { params }).then((r) => normaliseListPayload(r.data)),
  talentHunt: (params) => api.get('/admin/talent-hunt/', { params }).then((r) => normaliseListPayload(r.data)),
  vendors: (params) => api.get('/admin/vendors/', { params }).then((r) => normaliseListPayload(r.data)),
  jobApplications: (params) => api.get('/admin/job-applications/', { params }).then((r) => normaliseListPayload(r.data)),
  newsletter: (params) => api.get('/admin/newsletter/', { params }).then((r) => normaliseListPayload(r.data)),

  /** Review workflow shared by every submission type. */
  review: (resourceKey, id, payload) => {
    const base = ADMIN_RESOURCES[resourceKey] || resourceKey;
    return api.post(`${base}/${id}/review/`, payload).then((r) => r.data);
  },
  approve: (resourceKey, id, payload = {}) =>
    api.post(`${ADMIN_RESOURCES[resourceKey] || resourceKey}/${id}/approve/`, payload).then((r) => r.data),
  reject: (resourceKey, id, payload = {}) =>
    api.post(`${ADMIN_RESOURCES[resourceKey] || resourceKey}/${id}/reject/`, payload).then((r) => r.data),
  updateSubmission: (resourceKey, id, payload) =>
    api.patch(`${ADMIN_RESOURCES[resourceKey] || resourceKey}/${id}/`, payload).then((r) => r.data),
  removeSubmission: (resourceKey, id) =>
    api.delete(`${ADMIN_RESOURCES[resourceKey] || resourceKey}/${id}/`),

  users: (params) => api.get('/admin/users/', { params }).then((r) => normaliseListPayload(r.data)),
  createUser: (payload) => api.post('/admin/users/', payload).then((r) => r.data),
  updateUser: (id, payload) => api.patch(`/admin/users/${id}/`, payload).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}/`),
  setUserPassword: (id, password) =>
    api.post(`/admin/users/${id}/set-password/`, { new_password: password }).then((r) => r.data),
  toggleUserActive: (id, isActive) =>
    api.post(`/admin/users/${id}/toggle-active/`, { is_active: isActive }).then((r) => r.data),

  actionLogs: (params) => api.get('/admin/action-logs/', { params }).then((r) => normaliseListPayload(r.data)),
};

export { list };
export default adminApi;
