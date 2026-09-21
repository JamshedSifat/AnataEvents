import ResourceManager from './ResourceManager.jsx';
import { LoadingScreen } from '../../components/ui/States';
import { useApiResource } from '../../hooks/useApiResource';
import { contentApi } from '../../services/content';

/**
 * Service detail pages (corporate events, exhibition stalls, special events…).
 *
 * The `service` field is a real foreign key, so the options come from the API
 * instead of being hardcoded — adding a service immediately makes it available.
 */
const ServiceEntryManager = ({ serviceSlug, title, description }) => {
  const { data: service, loading } = useApiResource(() => contentApi.service(serviceSlug), [serviceSlug]);

  if (loading) return <LoadingScreen message="Loading service…" />;

  const serviceOptions = service ? [{ value: service.id, label: service.name }] : [];

  const fields = [
    { name: 'title', label: 'Title', required: true },
    { name: 'subtitle', label: 'Subtitle', required: false },
    { name: 'badge', label: 'Badge', required: false },
    { name: 'category', label: 'Category', required: false },
    { name: 'summary', label: 'Summary', type: 'textarea', required: false },
    { name: 'hero_subtitle', label: 'Hero subtitle', required: false },
    { name: 'body', label: 'Body (HTML)', type: 'textarea', rows: 8, required: false },
    { name: 'features', label: 'Features (JSON array)', type: 'json', rows: 4, required: false },
    { name: 'stats', label: 'Stats (JSON array)', type: 'json', rows: 3, required: false },
    { name: 'highlights', label: 'Highlights / why-choose cards (JSON)', type: 'json', rows: 5, required: false },
    { name: 'extra_sections', label: 'Extra sections (JSON)', type: 'json', rows: 4, required: false },
    { name: 'image', label: 'Hero image upload', type: 'file', required: false },
    { name: 'image_url', label: '…or hero image URL', required: false },
    { name: 'video_url', label: 'Video URL', required: false },
    { name: 'cta_title', label: 'CTA title', required: false },
    { name: 'cta_text', label: 'CTA text', required: false },
    { name: 'cta_button_label', label: 'CTA button label', required: false },
    { name: 'cta_button_url', label: 'CTA button URL', required: false },
    { name: 'client', label: 'Client', required: false },
    { name: 'location', label: 'Location', required: false },
    { name: 'event_date', label: 'Event date', type: 'date', required: false },
    { name: 'order', label: 'Order', type: 'number', required: false },
    { name: 'is_featured', label: 'Featured', type: 'checkbox', default: false },
    { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
  ];

  return (
    <ResourceManager
      resourceKey="serviceEntries"
      title={title}
      itemLabel="detail page"
      description={description}
      columns={[
        { key: 'image', label: 'Image', type: 'image' },
        { key: 'title', label: 'Title' },
        { key: 'badge', label: 'Badge' },
        { key: 'order', label: 'Order' },
        { key: 'is_published', label: 'Status', type: 'publish' },
      ]}
      fields={fields}
      defaults={{ service: service?.id }}
      fixedValues={{ service: service?.id }}
      serviceOptions={serviceOptions}
    />
  );
};

export default ServiceEntryManager;
