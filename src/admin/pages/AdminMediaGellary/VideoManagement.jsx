import ResourceManager from '../../components/ResourceManager.jsx';

const videoFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'youtube_url', label: 'YouTube URL', required: true, help: 'Only youtube.com / youtu.be links are accepted.' },
  { name: 'description', label: 'Description', type: 'textarea', required: false },
  { name: 'category', label: 'Category', type: 'select', options: [
    { value: 'home', label: 'Home' },
    { value: 'virtual', label: 'Virtual events' },
    { value: 'blog', label: 'Blog' },
    { value: 'corporate', label: 'Corporate' },
  ] },
  { name: 'duration', label: 'Duration', required: false },
    { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const VideoManagement = () => (
  <ResourceManager
    resourceKey="videos"
    title="Videos"
    itemLabel="video"
    description="YouTube embeds used across the site."
    columns={[
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'youtube_id', label: 'Video id' },
      { key: 'order', label: 'Order' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={videoFields}
  />
);

export default VideoManagement;
