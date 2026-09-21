import ResourceManager from '../../components/ResourceManager.jsx';
const serviceFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'badge', label: 'Badge' },
  { name: 'heading', label: 'Heading' },
  { name: 'heading_highlight', label: 'Heading highlight' },
  { name: 'summary', label: 'Summary', type: 'textarea' },
  { name: 'body', label: 'Body (HTML)', type: 'textarea', rows: 6 },
  { name: 'icon', label: 'Icon (emoji)' },
  { name: 'color_from', label: 'Gradient from (Tailwind class)' },
  { name: 'color_to', label: 'Gradient to (Tailwind class)' },
  { name: 'features', label: 'Features (JSON array)', type: 'json', rows: 4 },
  { name: 'image', label: 'Image upload', type: 'file', required: false },
  { name: 'image_url', label: '…or image URL', required: false },
  { name: 'seo_title', label: 'SEO title', required: false },
  { name: 'seo_description', label: 'SEO description', required: false, type: 'textarea', rows: 2 },
    { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
  { name: 'show_in_nav', label: 'Show in navigation', type: 'checkbox', default: true },
];

const ServiceManagement = () => (
  <ResourceManager
    resourceKey="services"
    title="Services"
    itemLabel="service"
    description="Public service pages. Slugs are generated from the name."
    columns={[
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'name', label: 'Name' },
      { key: 'badge', label: 'Badge' },
      { key: 'entries_count', label: 'Detail pages' },
      { key: 'order', label: 'Order' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={serviceFields}
    searchPlaceholder="Search services…"
  />
);

export default ServiceManagement;
