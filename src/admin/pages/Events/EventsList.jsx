import ResourceManager from '../../components/ResourceManager.jsx';

const eventFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: false },
  { name: 'venue', label: 'Venue', required: false },
  { name: 'city', label: 'City', required: false },
  { name: 'start_date', label: 'Start date', type: 'date', required: true },
  { name: 'end_date', label: 'End date', type: 'date', required: false },
  { name: 'start_time', label: 'Start time', required: false },
  { name: 'capacity', label: 'Capacity', type: 'number', required: false },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'ongoing', label: 'Ongoing' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
  { name: 'client', label: 'Client', required: false },
  { name: 'image', label: 'Cover upload', type: 'file', required: false },
  { name: 'image_url', label: '…or cover URL', required: false },
  { name: 'is_featured', label: 'Featured', type: 'checkbox', default: false },
  { name: 'is_published', label: 'Published', type: 'checkbox', default: true },
];

const EventsList = () => (
  <ResourceManager
    resourceKey="events"
    title="Events"
    itemLabel="event"
    description="Used by the dashboard calendar and any page that lists upcoming events."
    columns={[
      { key: 'image', label: 'Cover', type: 'image' },
      { key: 'title', label: 'Title' },
      { key: 'city', label: 'City' },
      { key: 'start_date', label: 'Starts', type: 'date' },
      { key: 'status', label: 'Status' },
      { key: 'is_published', label: 'Publish', type: 'publish' },
    ]}
    fields={eventFields}
    filters={[
      {
        name: 'status',
        label: 'All statuses',
        options: [
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
        ],
      },
    ]}
  />
);

export default EventsList;
