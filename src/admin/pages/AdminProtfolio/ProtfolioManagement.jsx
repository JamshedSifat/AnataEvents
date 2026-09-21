import ResourceManager from '../../components/ResourceManager.jsx';

const portfolioFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'client', label: 'Client', required: false },
  { name: 'category', label: 'Category', required: false },
  { name: 'description', label: 'Description', type: 'textarea', required: false },
  { name: 'location', label: 'Location', required: false },
  { name: 'event_date', label: 'Event date', type: 'date', required: false },
  { name: 'video_url', label: 'Video URL', required: false },
  { name: 'image', label: 'Cover upload', type: 'file', required: false },
  { name: 'image_url', label: '…or cover URL', required: false },
  { name: 'is_featured', label: 'Featured', type: 'checkbox', default: false },
  { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const PortfolioManagement = () => (
  <ResourceManager
    resourceKey="portfolio"
    title="Portfolio"
    itemLabel="project"
    columns={[
      { key: 'image', label: 'Cover', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'client', label: 'Client' },
      { key: 'category', label: 'Category' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={portfolioFields}
  />
);

export default PortfolioManagement;
