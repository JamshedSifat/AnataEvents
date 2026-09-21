import ResourceManager from '../../components/ResourceManager.jsx';

const blogFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'category', label: 'Category', required: false },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 3, required: false },
  { name: 'content', label: 'Content (HTML allowed)', type: 'textarea', rows: 12, required: true },
  { name: 'author_name', label: 'Author', required: false },
  { name: 'tags', label: 'Tags (JSON array)', type: 'json', rows: 3, required: false },
  { name: 'read_minutes', label: 'Read minutes', type: 'number', required: false },
  { name: 'image', label: 'Cover upload', type: 'file', required: false },
  { name: 'image_url', label: '…or cover URL', required: false },
  { name: 'is_featured', label: 'Featured', type: 'checkbox', default: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const BlogManagement = () => (
  <ResourceManager
    resourceKey="blogs"
    title="Blog posts"
    itemLabel="post"
    columns={[
      { key: 'image', label: 'Cover', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'author_name', label: 'Author' },
      { key: 'published_at', label: 'Published', type: 'date' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={blogFields}
  />
);

export default BlogManagement;
