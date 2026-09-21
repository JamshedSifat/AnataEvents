import ResourceManager from '../../../components/ResourceManager.jsx';

const artistFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: [
  { value: 'singer', label: 'Singer' },
  { value: 'dancer', label: 'Dancer / Choreographer' },
  { value: 'dj', label: 'DJ' },
  { value: 'magician', label: 'Magician' },
  { value: 'comedian', label: 'Comedian' },
] },
  { name: 'country', label: 'Country', required: false },
  { name: 'city', label: 'City', required: false },
  { name: 'genre', label: 'Genre', required: false },
  { name: 'styles', label: 'Styles (JSON array)', type: 'json', rows: 3, required: false },
  { name: 'bio', label: 'Bio', type: 'textarea', rows: 5, required: false },
  { name: 'famous_for', label: 'Famous for', required: false },
  { name: 'famous_show', label: 'Famous show', required: false },
  { name: 'experience_years', label: 'Experience (years)', type: 'number', required: false },
  { name: 'rating', label: 'Rating', required: false },
  { name: 'price', label: 'Price', required: false },
  { name: 'availability', label: 'Availability', required: false },
  { name: 'languages', label: 'Languages (JSON array)', type: 'json', rows: 2, required: false },
  { name: 'popular_songs', label: 'Popular songs (JSON array)', type: 'json', rows: 3, required: false },
  { name: 'achievements', label: 'Achievements (JSON array)', type: 'json', rows: 3, required: false },
  { name: 'social_followers', label: 'Followers', required: false },
  { name: 'contact_email', label: 'Contact email', type: 'email', required: false },
  { name: 'phone', label: 'Phone (BD format)', required: false },
  { name: 'website', label: 'Website', required: false },
  { name: 'instagram', label: 'Instagram', required: false },
  { name: 'facebook', label: 'Facebook', required: false },
  { name: 'youtube', label: 'YouTube', required: false },
  { name: 'video_url', label: 'Video URL', required: false },
  { name: 'image', label: 'Photo upload', type: 'file', required: false },
  { name: 'image_url', label: '…or photo URL', required: false },
  { name: 'image_alt', label: 'Alt text', required: false },
  { name: 'is_featured', label: 'Featured', type: 'checkbox', default: false },
  { name: 'order', label: 'Order', type: 'number', required: false },{ name: 'is_published', label: 'Published', type: 'checkbox', default: true },];


const AdminArtists = () => (
  <ResourceManager
    resourceKey="artists"
    title="Artists"
    itemLabel="artist"
    description="Performers shown on the Book-an-artist pages."
    columns={[
      { key: 'image', label: 'Photo', type: 'image' },
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'city', label: 'City' },
      { key: 'rating', label: 'Rating' },
      { key: 'order', label: 'Order' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={artistFields}
    filters={[{ name: 'category', label: 'All categories', options: [
  { value: 'singer', label: 'Singer' },
  { value: 'dancer', label: 'Dancer / Choreographer' },
  { value: 'dj', label: 'DJ' },
  { value: 'magician', label: 'Magician' },
  { value: 'comedian', label: 'Comedian' },
] }]}
  />
);

export default AdminArtists;
