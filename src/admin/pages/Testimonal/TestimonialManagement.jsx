import ResourceManager from '../../components/ResourceManager.jsx';

const testimonialFields = [
  { name: 'name', label: 'Client name', required: true },
  { name: 'designation', label: 'Designation', required: false },
  { name: 'company', label: 'Company', required: false },
  { name: 'event_type', label: 'Event type', required: false },
  { name: 'rating', label: 'Rating (1-5)', type: 'number', required: false },
  { name: 'review', label: 'Review', type: 'textarea', required: true },
  { name: 'image', label: 'Photo upload', type: 'file', required: false },
  { name: 'image_url', label: '…or photo URL', required: false },
    { name: 'order', label: 'Order', type: 'number', required: false },
  { name: 'is_featured', label: 'Featured', type: 'checkbox', default: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const TestimonialManagement = () => (
  <ResourceManager
    resourceKey="testimonials"
    title="Testimonials"
    itemLabel="testimonial"
    columns={[
      { key: 'name', label: 'Name' },
      { key: 'company', label: 'Company' },
      { key: 'rating', label: 'Rating' },
      { key: 'is_published', label: 'Status', type: 'publish' },
    ]}
    fields={testimonialFields}
  />
);

export default TestimonialManagement;
