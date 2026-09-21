import ResourceManager from '../../components/ResourceManager.jsx';

const heroFields = [
  { name: 'heading', label: 'Heading' },
  { name: 'subtitle', label: 'Subtitle' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'stats', label: 'Stats badge (e.g. 500+ Events)' },
  { name: 'image', label: 'Image upload', type: 'file', required: false },
  { name: 'image_url', label: '…or image URL', required: false },
  { name: 'cta_label', label: 'Button label', required: false },
  { name: 'cta_url', label: 'Button URL', required: false },
    { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const AdminHero = () => (
  <ResourceManager
    resourceKey="heroSlides"
    title="Hero slides"
    itemLabel="slide"
    description="Images rotate every five seconds on the home page."
    columns={[
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'heading', label: 'Heading' },
      { key: 'subtitle', label: 'Subtitle' },
      { key: 'order', label: 'Order' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={heroFields}
  />
);

export default AdminHero;
