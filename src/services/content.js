/** Public content endpoints (read-only) plus the shared form submissions. */
import api from './api';

const unwrap = (response) => response.data;
const list = (response) => {
  const data = response.data;
  return Array.isArray(data) ? data : data?.results || [];
};

export const contentApi = {
  settings: () => api.get('/settings/').then(unwrap),

  heroSlides: () => api.get('/hero-slides/').then(list),

  services: (params) => api.get('/services/', { params }).then(list),
  service: (slug) => api.get(`/services/${slug}/`).then(unwrap),
  serviceEntries: (params) => api.get('/service-entries/', { params }).then(list),
  serviceEntry: (id) => api.get(`/service-entries/${id}/`).then(unwrap),
  serviceEntryBySlug: (slug, params) =>
    api.get(`/service-entries/${slug}/`, { params }).then(unwrap),

  artists: (params) => api.get('/artists/', { params }).then(list),
  artist: (slug) => api.get(`/artists/${slug}/`).then(unwrap),

  influencers: (params) => api.get('/influencers/', { params }).then(list),

  portfolio: (params) => api.get('/portfolio/', { params }).then(list),
  portfolioItem: (slug) => api.get(`/portfolio/${slug}/`).then(unwrap),

  gallery: (params) => api.get('/gallery/', { params }).then(list),

  videos: (params) => api.get('/videos/', { params }).then(list),

  blogs: (params) => api.get('/blogs/', { params }).then(list),
  blog: (slug) => api.get(`/blogs/${slug}/`).then(unwrap),

  testimonials: () => api.get('/testimonials/').then(list),

  team: () => api.get('/team/').then(list),

  faqs: (params) => api.get('/faqs/', { params }).then(list),

  jobs: (params) => api.get('/jobs/', { params }).then(list),
  job: (slug) => api.get(`/jobs/${slug}/`).then(unwrap),

  events: (params) => api.get('/events/', { params }).then(list),

  blocks: (params) => api.get('/blocks/', { params }).then(list),
  /** Convenience helper: every block for a section, keyed by `value`. */
  blocksBySection: async (section) => {
    const items = await api.get('/blocks/', { params: { section, page_size: 100 } }).then(list);
    return items.reduce((acc, item) => {
      const key = item.value || item.title || String(item.id);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  },
};

export const formsApi = {
  contact: (payload) => api.post('/contact/', payload).then(unwrap),
  artistBooking: (payload) => api.post('/artist-bookings/', payload).then(unwrap),
  artistApplication: (payload) => api.post('/artist-applications/', payload).then(unwrap),
  talentHunt: (payload) => api.post('/talent-hunt/', payload).then(unwrap),
  vendorRegistration: (payload) => api.post('/vendor-registrations/', payload).then(unwrap),
  jobApplication: (payload) => api.post('/job-applications/', payload).then(unwrap),
  newsletter: (payload) => api.post('/newsletter/', payload).then(unwrap),
};

export default contentApi;
