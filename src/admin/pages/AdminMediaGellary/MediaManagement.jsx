import ResourceManager from '../../components/ResourceManager.jsx';

const galleryFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'album', label: 'Album', type: 'select', options: [
  { value: 'corporate', label: 'Corporate' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'concert', label: 'Concert' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'award', label: 'Award' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'party', label: 'Party' },
  { value: 'conference', label: 'Conference' },
  { value: 'virtual', label: 'Virtual' },
] },
  { name: 'caption', label: 'Caption', required: false },
  { name: 'image', label: 'Image upload', type: 'file', required: false },
  { name: 'image_url', label: '…or image URL', required: false },
  { name: 'image_alt', label: 'Alt text (accessibility)', required: false },
    { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const MediaManagement = () => (
  <ResourceManager
    resourceKey="gallery"
    title="Gallery"
    itemLabel="image"
    description="Photos used by /media/gallery."
    columns={[
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'album', label: 'Album' },
      { key: 'order', label: 'Order' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={galleryFields}
    filters={[{ name: 'album', label: 'All albums', options: [
  { value: 'corporate', label: 'Corporate' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'concert', label: 'Concert' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'award', label: 'Award' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'party', label: 'Party' },
  { value: 'conference', label: 'Conference' },
  { value: 'virtual', label: 'Virtual' },
] }]}
  />
);

export default MediaManagement;
