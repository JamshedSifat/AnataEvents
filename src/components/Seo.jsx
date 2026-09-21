import { useEffect } from 'react';

const SITE_NAME = 'Ananta Events';
const DEFAULT_TITLE = 'Ananta Events | Best Event Management Company in Bangladesh';
const DEFAULT_DESCRIPTION =
  'Ananta Events plans and delivers corporate events, weddings, exhibitions, concerts and celebrity bookings across Bangladesh.';

function upsertMeta(selector, attrs) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }
  Object.entries(attrs).forEach(([key, value]) => tag.setAttribute(key, value));
  return tag;
}

/**
 * Per-route SEO: unique document title, description, Open Graph/Twitter tags
 * and robots directives (admin pages are always `noindex, nofollow`).
 *
 * (Replaces the old loader-based `document.title` hack, and stands in for
 * react-helmet-async, which does not support React 19 without a peer override.)
 */
const Seo = ({ title, description, image, canonical, noIndex = false, type = 'website' }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: 'description', content: desc });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: desc });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: desc });

    const url = canonical || (typeof window !== 'undefined' ? window.location.href : '');
    if (url) {
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
      upsertMeta('meta[name="twitter:url"]', { name: 'twitter:url', content: url });
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    }

    if (image) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    }

    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    });
  }, [title, description, image, canonical, noIndex, type]);

  return null;
};

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION, SITE_NAME };
export default Seo;
