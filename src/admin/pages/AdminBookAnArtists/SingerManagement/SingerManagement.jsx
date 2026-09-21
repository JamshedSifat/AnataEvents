import ResourceManager from '../../../components/ResourceManager.jsx';

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'country', label: 'Country', required: false },
  { name: 'city', label: 'City', required: false },
  { name: 'genre', label: 'Genre', required: false },
  { name: 'bio', label: 'Bio', type: 'textarea', rows: 4, required: false },
  { name: 'experience_years', label: 'Experience (years)', type: 'number', required: false },
  { name: 'rating', label: 'Rating', required: false },
  { name: 'price', label: 'Price', required: false },
  { name: 'image', label: 'Photo upload', type: 'file', required: false },
  { name: 'image_url', label: '…or photo URL', required: false },
    { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const SingerManagement = () => (
  <ResourceManager
    resourceKey="artists"
    title="Singers"
    itemLabel="artist"
    columns={[
      { key: 'image', label: 'Photo', type: 'image' },
      { key: 'name', label: 'Name' },
      { key: 'city', label: 'City' },
      { key: 'rating', label: 'Rating' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={fields}
    filters={[]}
  />
);

export default SingerManagement;
