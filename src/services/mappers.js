/**
 * Adapters between the API payloads and the field names the existing UI
 * components already render. Keeping the mapping here means the visual layer
 * did not have to change when the data moved from localStorage to the API.
 */

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return value.split(',').map((item) => item.trim());
  return [];
};

export const mapArtist = (artist) => ({
  _id: artist.id,
  id: artist.id,
  slug: artist.slug,
  name: artist.name,
  category: artist.category,
  image: artist.image_src || '',
  rating: artist.rating,
  genre: artist.genre,
  genres: asArray(artist.genre).length ? asArray(artist.genre) : asArray(artist.styles),
  styles: asArray(artist.styles),
  description: artist.bio,
  bio: artist.bio,
  experience: artist.experience_years,
  experience_years: artist.experience_years,
  famous_for: artist.famous_for,
  famous_show: artist.famous_show,
  city: artist.city,
  country: artist.country,
  price: artist.price,
  availability: artist.availability,
  tour_status: artist.availability,
  followers: artist.social_followers,
  language: artist.languages,
  languages: asArray(artist.languages),
  popular_songs: asArray(artist.popular_songs),
  achievements: asArray(artist.achievements),
  awards: asArray(artist.achievements),
  media_presence: asArray(artist.media_presence),
  contact_email: artist.contact_email,
  phone: artist.phone,
  website: artist.website,
  instagram: artist.instagram,
  facebook: artist.facebook,
  youtube: artist.youtube,
  video_url: artist.video_url,
  is_featured: artist.is_featured,
});

export const mapService = (service) => ({
  _id: service.id,
  id: service.id,
  title: service.name,
  slug: service.slug,
  name: service.name,
  badge: service.badge,
  description: service.summary,
  summary: service.summary,
  body: service.body,
  features: asArray(service.features),
  icon: service.icon,
  color_from: service.color_from,
  color_to: service.color_to,
  image: service.image_src || '',
  entriesCount: service.entries_count ?? 0,
  lightGradient: `${service.color_from || 'from-primary'} ${service.color_to || 'to-secondary'}`,
});

export const mapServiceEntry = (entry) => ({
  _id: entry.id,
  id: entry.id,
  slug: entry.slug,
  title: entry.title,
  subtitle: entry.subtitle,
  badge: entry.badge,
  category: entry.category,
  summary: entry.summary,
  description: entry.summary,
  heroSubtitle: entry.hero_subtitle,
  body: entry.body,
  introTitle: entry.intro_title,
  galleryTitle: entry.gallery_title,
  highlightsTitle: entry.highlights_title,
  featuresTitle: entry.features_title,
  features: asArray(entry.features),
  services: asArray(entry.features),
  stats: asArray(entry.stats),
  highlights: asArray(entry.highlights),
  extraSections: asArray(entry.extra_sections),
  galleryImages: (entry.gallery || []).map((image) => ({
    id: image.id,
    url: image.image_src,
    caption: image.caption,
    title: image.caption,
  })),
  image: entry.image_src || '',
  videoUrl: entry.video_url,
  ctaTitle: entry.cta_title,
  ctaText: entry.cta_text,
  ctaButtonLabel: entry.cta_button_label,
  ctaButtonUrl: entry.cta_button_url,
  client: entry.client,
  location: entry.location,
  eventDate: entry.event_date,
  isFeatured: entry.is_featured,
  serviceSlug: entry.service_slug,
  serviceName: entry.service_name,
});

export const mapGalleryImage = (image) => ({
  _id: image.id,
  id: image.id,
  title: image.title,
  category: image.album || 'corporate',
  album: image.album,
  url: image.image_src || '',
  image: image.image_src || '',
  description: image.caption,
  caption: image.caption,
});

export const mapVideo = (video) => ({
  _id: video.id,
  id: video.id,
  title: video.title,
  description: video.description,
  category: video.category,
  youtubeId: video.youtube_id,
  youtubeUrl: video.youtube_url,
  embed: video.youtube_embed,
  duration: video.duration,
});

export const mapBlog = (blog) => ({
  _id: blog.id,
  id: blog.id,
  slug: blog.slug,
  title: blog.title,
  category: blog.category,
  excerpt: blog.excerpt,
  content: blog.content,
  author: blog.author_name,
  tags: asArray(blog.tags),
  featured: blog.is_featured,
  image: blog.image_src || '',
  date: blog.published_at || blog.created_at,
  readMinutes: blog.read_minutes,
  views: blog.views,
});

export const mapTestimonial = (item) => ({
  _id: item.id,
  id: item.id,
  name: item.name,
  designation: item.designation,
  company: item.company,
  eventType: item.event_type,
  rating: item.rating,
  review: item.review,
  image: item.image_src || '',
});

export const mapTeamMember = (member) => ({
  _id: member.id,
  id: member.id,
  name: member.name,
  role: member.role,
  description: member.description,
  image: member.image_src || '',
  email: member.email,
  phone: member.phone,
  social: {
    linkedin: member.linkedin,
    facebook: member.facebook,
    instagram: member.instagram,
    twitter: member.twitter,
  },
});

export const mapPortfolio = (item) => ({
  _id: item.id,
  id: item.id,
  slug: item.slug,
  title: item.title,
  client: item.client,
  category: item.category,
  description: item.description,
  location: item.location,
  date: item.event_date,
  eventDate: item.event_date,
  image: item.image_src || '',
  videoUrl: item.video_url,
  featured: item.is_featured,
  gallery: (item.gallery || []).map((image) => ({ id: image.id, url: image.image_src, caption: image.caption })),
});

export const mapFaq = (faq) => ({
  _id: faq.id,
  id: faq.id,
  question: faq.question,
  answer: faq.answer,
  section: faq.section,
});

export const mapJob = (job) => ({
  _id: job.id,
  id: job.id,
  slug: job.slug,
  title: job.title,
  department: job.department,
  location: job.location,
  type: job.employment_type,
  employment_type: job.employment_type,
  experience: job.experience,
  salary: job.salary,
  description: job.description,
  requirements: asArray(job.requirements),
  responsibilities: asArray(job.responsibilities),
  deadline: job.deadline,
  vacancies: job.vacancies,
});

export const mapContentBlock = (block) => ({
  _id: block.id,
  id: block.id,
  section: block.section,
  title: block.title,
  subtitle: block.subtitle,
  description: block.description,
  icon: block.icon,
  value: block.value,
  url: block.url,
  image: block.image_src || '',
  extra: block.extra || {},
});
