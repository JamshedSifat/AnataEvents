import ResourceManager from '../../components/ResourceManager.jsx';

const influencerFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'handle', label: 'Handle', required: false },
  { name: 'platform', label: 'Platform', type: 'select', required: true, options: [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
  ] },
  { name: 'followers', label: 'Followers', required: false },
  { name: 'engagement_rate', label: 'Engagement rate', required: false },
  { name: 'niche', label: 'Niche', required: false },
  { name: 'country', label: 'Country', required: false },
  { name: 'city', label: 'City', required: false },
  { name: 'bio', label: 'Bio', type: 'textarea', required: false },
  { name: 'profile_url', label: 'Profile URL', required: false },
  { name: 'image', label: 'Photo upload', type: 'file', required: false },
  { name: 'image_url', label: '…or photo URL', required: false },
  { name: 'is_featured', label: 'Featured', type: 'checkbox', default: false },
    { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const AdminInfluencers = () => (
  <ResourceManager
    resourceKey="influencers"
    title="Influencers"
    itemLabel="influencer"
    columns={[
      { key: 'image', label: 'Photo', type: 'image' },
      { key: 'name', label: 'Name' },
      { key: 'platform', label: 'Platform' },
      { key: 'followers', label: 'Followers' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={influencerFields}
  />
);

export default AdminInfluencers;
